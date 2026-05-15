import Editor from "@monaco-editor/react";
import {
  Check,
  Copy,
  Loader2,
  Maximize2,
  Minimize2,
  Play,
  Terminal,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  acknowledgeEditorState,
  applyEditorState,
  editorStarterCode,
  markSaved,
  setCode,
  setEditorError,
  setLanguage,
  setSyncing,
} from "@/features/editor/editorSlice";
import { toggleFullscreenEditor } from "@/features/ui/uiSlice";
import { Button } from "@/components/common/Button";
import { connectSocket, socketEvents } from "@/lib/socket";
import { editorService } from "@/services/editorService";

const langs = [
  "typescript",
  "javascript",
  "python",
  "go",
  "java",
  "cpp",
  "rust",
];
const syncDelayMs = 300;
const outputMinHeight = 120;
const outputMaxHeight = 420;

export function CodeEditor({ roomId }) {
  const { language, code, saved, syncing, version, error } = useAppSelector(
    (s) => s.editor,
  );
  const fullscreen = useAppSelector((s) => s.ui.fullscreenEditor);
  const dispatch = useAppDispatch();
  const [copied, setCopied] = useState(false);
  const [running, setRunning] = useState(false);
  const [execution, setExecution] = useState(null);
  const [outputHeight, setOutputHeight] = useState(176);
  const applyingRemote = useRef(false);
  const syncTimer = useRef(null);
  const latestCode = useRef(code);
  const versionRef = useRef(version);

  useEffect(() => {
    latestCode.current = code;
    versionRef.current = version;
  }, [code, version]);

  const applyRemoteState = useCallback(
    (payload) => {
      const state = payload?.state ?? payload;
      if (!state) return;

      applyingRemote.current = true;
      latestCode.current = state.code ?? latestCode.current;
      versionRef.current = state.version ?? versionRef.current;
      dispatch(applyEditorState(state));

      window.setTimeout(() => {
        applyingRemote.current = false;
      }, 0);
    },
    [dispatch],
  );

  const handleSyncResponse = useCallback(
    (response, sentCode = null) => {
      if (response?.success === false) {
        if (response.state) {
          applyRemoteState(response.state);
          return;
        }

        dispatch(setEditorError(response.message || "Editor sync failed"));
        return;
      }

      if (!response?.state) {
        dispatch(setSyncing(false));
        return;
      }

      versionRef.current = response.state.version ?? versionRef.current;

      if (sentCode === null || latestCode.current === sentCode) {
        applyRemoteState(response.state);
        return;
      }

      dispatch(acknowledgeEditorState(response.state));
    },
    [applyRemoteState, dispatch],
  );

  useEffect(() => {
    const socket = connectSocket();

    if (!socket || !roomId) {
      dispatch(setEditorError("Realtime editor unavailable"));
      return undefined;
    }

    const handleState = (payload) => applyRemoteState(payload);
    const handleError = (payload) => {
      dispatch(setEditorError(payload?.message || "Editor sync failed"));
    };
    const handleConnectError = () => {
      dispatch(setEditorError("Realtime editor connection failed"));
    };
    const requestEditorState = () => {
      socket.emit(socketEvents.EDITOR_REQUEST_STATE, { roomId });
    };

    socket.on(socketEvents.EDITOR_STATE, handleState);
    socket.on(socketEvents.EDITOR_CHANGED, handleState);
    socket.on(socketEvents.EDITOR_LANGUAGE_CHANGED, handleState);
    socket.on(socketEvents.EDITOR_SAVED, handleState);
    socket.on(socketEvents.EDITOR_SYNC_ERROR, handleError);
    socket.on("connect_error", handleConnectError);
    socket.on("connect", requestEditorState);

    if (socket.connected) {
      requestEditorState();
    }

    return () => {
      if (syncTimer.current) {
        clearTimeout(syncTimer.current);
      }

      socket.off(socketEvents.EDITOR_STATE, handleState);
      socket.off(socketEvents.EDITOR_CHANGED, handleState);
      socket.off(socketEvents.EDITOR_LANGUAGE_CHANGED, handleState);
      socket.off(socketEvents.EDITOR_SAVED, handleState);
      socket.off(socketEvents.EDITOR_SYNC_ERROR, handleError);
      socket.off("connect_error", handleConnectError);
      socket.off("connect", requestEditorState);
    };
  }, [applyRemoteState, dispatch, roomId]);

  const syncCode = useCallback(
    (nextCode) => {
      if (applyingRemote.current || nextCode === latestCode.current) return;

      dispatch(setCode(nextCode));
      latestCode.current = nextCode;

      if (!roomId) return;

      dispatch(setSyncing(true));

      if (syncTimer.current) {
        clearTimeout(syncTimer.current);
      }

      syncTimer.current = window.setTimeout(() => {
        const socket = connectSocket();

        if (!socket) {
          dispatch(setEditorError("Realtime editor unavailable"));
          return;
        }

        const sentCode = latestCode.current;
        socket.emit(
          socketEvents.EDITOR_CHANGE,
          { roomId, code: sentCode, version: versionRef.current },
          (response) => handleSyncResponse(response, sentCode),
        );
      }, syncDelayMs);
    },
    [dispatch, handleSyncResponse, roomId],
  );

  const syncLanguage = useCallback(
    (nextLanguage) => {
      const nextCode = editorStarterCode[nextLanguage] ?? "";

      dispatch(setLanguage(nextLanguage));
      dispatch(setSyncing(true));
      latestCode.current = nextCode;

      if (syncTimer.current) {
        clearTimeout(syncTimer.current);
      }

      const socket = connectSocket();

      if (!socket || !roomId) {
        dispatch(setEditorError("Realtime editor unavailable"));
        return;
      }

      socket.emit(
        socketEvents.EDITOR_LANGUAGE_CHANGE,
        {
          roomId,
          language: nextLanguage,
          code: nextCode,
          version: versionRef.current,
        },
        (response) => handleSyncResponse(response),
      );
    },
    [dispatch, handleSyncResponse, roomId],
  );

  const saveEditorState = useCallback(() => {
    const socket = connectSocket();

    if (!socket || !roomId) {
      dispatch(markSaved());
      return;
    }

    dispatch(setSyncing(true));
    socket.emit(socketEvents.EDITOR_SAVE, { roomId }, (response) => {
      handleSyncResponse(response);
    });
  }, [dispatch, handleSyncResponse, roomId]);

  const runCode = useCallback(async () => {
    if (!roomId || running) return;

    setRunning(true);
    setExecution({
      status: "running",
      stdout: "",
      stderr: "",
      durationMs: null,
      exitCode: null,
    });

    try {
      const result = await editorService.runCode(roomId, {
        language,
        code: latestCode.current,
      });

      setExecution(result.execution);
    } catch (error) {
      setExecution({
        status: "failed",
        stdout: "",
        stderr: error.message || "Code execution failed",
        durationMs: null,
        exitCode: null,
      });
    } finally {
      setRunning(false);
    }
  }, [language, roomId, running]);

  function copy() {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div className="glass flex h-full min-h-0 flex-col overflow-hidden rounded-2xl">
      <div className="flex flex-wrap items-center gap-2 border-b border-border/60 px-3 py-2">
        <select
          value={language}
          onChange={(e) => syncLanguage(e.target.value)}
          className="h-8 rounded-lg border border-border bg-background/60 px-2 text-xs"
        >
          {langs.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
        <button
          onClick={copy}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border px-2.5 text-xs text-muted-foreground hover:text-foreground"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />} {roomId}
        </button>
        <span className="text-xs text-muted-foreground">
          {error ? (
            <span className="text-destructive">{error}</span>
          ) : syncing ? (
            <span className="inline-flex items-center gap-1">
              <Loader2 size={12} className="animate-spin" /> syncing
            </span>
          ) : saved ? (
            <span className="text-success">● saved</span>
          ) : (
            <span className="text-warning">● unsaved</span>
          )}
        </span>
        <div className="ml-auto flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => dispatch(toggleFullscreenEditor())}
          >
            {fullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </Button>
          <Button size="sm" variant="outline" onClick={saveEditorState}>
            <Check size={14} /> Save
          </Button>
          <Button size="sm" onClick={runCode} disabled={running}>
            {running ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Play size={14} />
            )}
            Run
          </Button>
        </div>
      </div>
      <div className="min-h-0 flex-1">
        <Editor
          height="100%"
          theme="vs-dark"
          language={language}
          value={code}
          onChange={(v) => syncCode(v ?? "")}
          options={{
            fontSize: 13,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            fontLigatures: true,
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            padding: { top: 12 },
          }}
          loading={
            <div className="grid h-full place-items-center text-muted-foreground">
              <Loader2 className="animate-spin" />
            </div>
          }
        />
      </div>
      {execution && (
        <ExecutionOutput
          execution={execution}
          height={outputHeight}
          onHeightChange={setOutputHeight}
        />
      )}
    </div>
  );
}

function ExecutionOutput({ execution, height, onHeightChange }) {
  const output =
    [execution.stdout, execution.stderr].filter(Boolean).join("\n") ||
    "Program finished with no output.";
  const failed = execution.status !== "completed";

  const startResize = useCallback(
    (event) => {
      event.preventDefault();

      const startY = event.clientY;
      const startHeight = height;

      const resize = (moveEvent) => {
        const nextHeight = startHeight + startY - moveEvent.clientY;
        onHeightChange(
          Math.min(outputMaxHeight, Math.max(outputMinHeight, nextHeight)),
        );
      };
      const stopResize = () => {
        document.removeEventListener("pointermove", resize);
        document.removeEventListener("pointerup", stopResize);
      };

      document.addEventListener("pointermove", resize);
      document.addEventListener("pointerup", stopResize);
    },
    [height, onHeightChange],
  );

  return (
    <div
      className="flex shrink-0 flex-col border-t border-border/60 bg-background/80"
      style={{ height }}
    >
      <button
        type="button"
        aria-label="Resize output panel"
        onPointerDown={startResize}
        className="h-2 cursor-row-resize border-b border-border/40 bg-secondary/30 hover:bg-primary/30"
      />
      <div className="flex items-center justify-between px-3 py-2 text-xs">
        <span className="inline-flex items-center gap-1.5 font-medium">
          <Terminal size={13} />
          Output
        </span>
        <span className={failed ? "text-destructive" : "text-success"}>
          {execution.status}
          {typeof execution.exitCode === "number"
            ? ` · exit ${execution.exitCode}`
            : ""}
          {typeof execution.durationMs === "number"
            ? ` · ${execution.durationMs}ms`
            : ""}
        </span>
      </div>
      <pre
        className={
          "min-h-0 flex-1 overflow-auto whitespace-pre-wrap px-3 pb-3 text-xs leading-5 " +
          (failed ? "text-destructive" : "text-foreground")
        }
      >
        {output}
      </pre>
    </div>
  );
}
