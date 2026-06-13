import Editor from "@monaco-editor/react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Code2,
  FilePlus2,
  Loader2,
  Maximize2,
  Minimize2,
  Play,
  RotateCcw,
  Save,
  Terminal,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { Input } from "@/components/common/Input";
import { ExecutionOutput } from "@/components/editor/ExecutionOutput";
import { editorStarterCode } from "@/features/editor/editorSlice";
import { editorService } from "@/services/editorService";
import { useAppSelector } from "@/store/hooks";
import { cn } from "@/lib/cn";

const languages = [
  "typescript",
  "javascript",
  "python",
  "go",
  "java",
  "cpp",
  "rust",
];

const initialLanguage = "javascript";

const snapshotFor = ({ language, code, stdin }) => ({
  language,
  code,
  stdin,
});

const isSameSnapshot = (snapshot, state) => {
  if (!snapshot) return false;

  return (
    snapshot.language === state.language &&
    snapshot.code === state.code &&
    snapshot.stdin === state.stdin
  );
};

const formatSavedAt = (value) => {
  if (!value) return "Not saved";

  return new Date(value).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

function upsertFile(files, file) {
  const exists = files.some((item) => item.id === file.id);
  const nextFiles = exists
    ? files.map((item) => (item.id === file.id ? file : item))
    : [file, ...files];

  return nextFiles.sort((a, b) => {
    return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
  });
}

export default function PlaygroundPage() {
  const editorThemePreference = useAppSelector((state) => {
    return state.auth.user?.preferences?.defaultEditorTheme || "dark";
  });
  const [language, setLanguage] = useState(initialLanguage);
  const [code, setCode] = useState(editorStarterCode[initialLanguage]);
  const [stdin, setStdin] = useState("");
  const [running, setRunning] = useState(false);
  const [execution, setExecution] = useState(null);
  const [outputHeight, setOutputHeight] = useState(176);
  const [systemPrefersDark, setSystemPrefersDark] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [files, setFiles] = useState([]);
  const [filesStatus, setFilesStatus] = useState("loading");
  const [filesError, setFilesError] = useState("");
  const [activeFile, setActiveFile] = useState(null);
  const [savedSnapshot, setSavedSnapshot] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveAsOpen, setSaveAsOpen] = useState(false);
  const [saveMode, setSaveMode] = useState("saveAs");
  const [fileName, setFileName] = useState("");
  const [pendingFileId, setPendingFileId] = useState(null);
  const latestCode = useRef(code);

  const localCode = localStorage.getItem('localCode')
  const localLanguage = localStorage.getItem('localLanguage')
  useEffect(()=>{
    if(localCode) {
      setCode(localCode)
      setLanguage(localLanguage)
    }
  }, [])
  useEffect(()=>{
    localStorage.setItem('localCode', code)
    localStorage.setItem('localLanguage', language)
  }, [code])

  useEffect(()=>{
    console.log('fullscreen:', fullscreen)
  }, [fullscreen])

  const dirty = useMemo(() => {
    if (!activeFile && !savedSnapshot) {
      return Boolean(
        code !== editorStarterCode[language] ||
        stdin ||
        language !== initialLanguage,
      );
    }

    return !isSameSnapshot(savedSnapshot, { language, code, stdin });
  }, [activeFile, code, language, savedSnapshot, stdin]);

  useEffect(() => {
    latestCode.current = code;
  }, [code]);

  useEffect(() => {
    let active = true;

    async function loadFiles() {
      setFilesStatus("loading");
      setFilesError("");

      try {
        const result = await editorService.listPlaygroundFiles();

        if (!active) return;
        setFiles(result.files || []);
        setFilesStatus("ready");
      } catch (error) {
        if (!active) return;
        setFilesError(error.message || "Unable to load playground files");
        setFilesStatus("failed");
      }
    }

    loadFiles();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const media = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!media) return undefined;

    setSystemPrefersDark(media.matches);

    const updatePreference = (event) => {
      setSystemPrefersDark(event.matches);
    };

    media.addEventListener("change", updatePreference);

    return () => {
      media.removeEventListener("change", updatePreference);
    };
  }, []);

  useEffect(() => {
    if (!fullscreen) return undefined;

    const handleKeydown = (event) => {
      if (event.key === "Escape") {
        setFullscreen(false);
      }
    };

    document.addEventListener("keydown", handleKeydown);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [fullscreen]);

  const monacoTheme = useMemo(() => {
    if (editorThemePreference === "system") {
      return systemPrefersDark ? "vs-dark" : "light";
    }

    return editorThemePreference === "light" ? "light" : "vs-dark";
  }, [editorThemePreference, systemPrefersDark]);

  function updateFiles(file) {
    setFiles((current) => upsertFile(current, file));
  }

  function applyFile(file) {
    setActiveFile(file);
    setLanguage(file.language);
    setCode(file.code || "");
    setStdin(file.stdin || "");
    setExecution(null);
    setSaveError("");
    setSavedSnapshot(
      snapshotFor({
        language: file.language,
        code: file.code || "",
        stdin: file.stdin || "",
      }),
    );
  }

  function changeLanguage(nextLanguage) {
    setLanguage(nextLanguage);
    setCode(editorStarterCode[nextLanguage] ?? "");
    setExecution(null);
    setSaveError("");
  }

  function resetCode() {
    setCode(editorStarterCode[language] ?? "");
    setExecution(null);
    setSaveError("");
  }

  function openSaveDialog(mode) {
    setSaveMode(mode);
    setFileName(mode === "saveAs" ? "" : activeFile?.name || "");
    setSaveError("");
    setSaveAsOpen(true);
  }

  async function saveActiveFile() {
    if (!activeFile) {
      openSaveDialog("save");
      return;
    }

    setSaving(true);
    setSaveError("");

    try {
      const result = await editorService.updatePlaygroundFile(activeFile.id, {
        language,
        code: latestCode.current,
        stdin,
      });

      updateFiles(result.file);
      applyFile(result.file);
    } catch (error) {
      setSaveError(error.message || "Unable to save file");
    } finally {
      setSaving(false);
    }
  }

  async function createSavedFile(event) {
    event.preventDefault();
    const name = fileName.trim();

    if (!name || saving) return;

    setSaving(true);
    setSaveError("");

    try {
      const result = await editorService.createPlaygroundFile({
        name,
        language,
        code: latestCode.current,
        stdin,
      });

      updateFiles(result.file);
      applyFile(result.file);
      setSaveAsOpen(false);
      setFileName("");
    } catch (error) {
      setSaveError(error.message || "Unable to save file");
    } finally {
      setSaving(false);
    }
  }

  async function loadFile(fileId) {
    setFilesError("");

    try {
      const result = await editorService.openPlaygroundFile(fileId);
      updateFiles(result.file);
      applyFile(result.file);
    } catch (error) {
      setFilesError(error.message || "Unable to open file");
    }
  }

  function requestFileOpen(fileId) {
    if (activeFile?.id === fileId) return;

    if (dirty) {
      setPendingFileId(fileId);
      return;
    }

    loadFile(fileId);
  }

  async function confirmPendingFileOpen() {
    const fileId = pendingFileId;
    setPendingFileId(null);

    if (fileId) {
      await loadFile(fileId);
    }
  }

  async function runCode() {
    if (running) return;

    setRunning(true);
    setExecution({
      status: "running",
      stdout: "",
      stderr: "",
      durationMs: null,
      exitCode: null,
    });

    try {
      const result = await editorService.runPlaygroundCode({
        language,
        code: latestCode.current,
        stdin,
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
  }

  const editorWorkspace = (
    <EditorWorkspace
      activeFile={activeFile}
      code={code}
      dirty={dirty}
      execution={execution}
      fullscreen={fullscreen}
      language={language}
      languages={languages}
      monacoTheme={monacoTheme}
      outputHeight={outputHeight}
      running={running}
      saveError={saveError}
      saving={saving}
      onCodeChange={(nextCode) => {
        setCode(nextCode);
        setSaveError("");
      }}
      onFullscreenChange={setFullscreen}
      onLanguageChange={changeLanguage}
      onOutputHeightChange={setOutputHeight}
      onReset={resetCode}
      onRun={runCode}
      onSave={saveActiveFile}
      onSaveAs={() => openSaveDialog("saveAs")}
    />
  );

  return (
    <AppShell>
      <div className="flex h-[calc(100vh-8rem)] min-h-[680px] flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="mt-3 text-2xl font-semibold">Code playground</h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Write, save, and run snippets before interviews.
            </p>
          </div>
        </div>

        <div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
          {!fullscreen && editorWorkspace}

          <aside className="grid min-h-0 gap-4 xl:grid-rows-[minmax(0,1fr)_auto]">
            <SavedFilesPanel
              activeFileId={activeFile?.id}
              error={filesError}
              files={files}
              status={filesStatus}
              onSelect={requestFileOpen}
            />
            <Card>
              <div className="flex items-center gap-2 text-sm font-medium">
                <Terminal size={15} />
                Standard input
              </div>
              <textarea
                value={stdin}
                onChange={(event) => {
                  setStdin(event.target.value);
                  setSaveError("");
                }}
                placeholder="Optional stdin for your program"
                className="mt-3 h-36 w-full resize-none rounded-lg border border-border bg-background/60 p-3 font-mono text-xs leading-5 outline-none focus:ring-2 focus:ring-ring"
              />
            </Card>
          </aside>
        </div>
      </div>

      {fullscreen && (
        <div className="fixed inset-0 z-50 bg-background p-3 md:p-4">
          {editorWorkspace}
        </div>
      )}

      {saveAsOpen && (
        <SaveFileModal
          error={saveError}
          fileName={fileName}
          mode={saveMode}
          saving={saving}
          onClose={() => {
            if (!saving) setSaveAsOpen(false);
          }}
          onFileNameChange={setFileName}
          onSubmit={createSavedFile}
        />
      )}

      {pendingFileId && (
        <ConfirmReplaceModal
          onCancel={() => setPendingFileId(null)}
          onConfirm={confirmPendingFileOpen}
        />
      )}
    </AppShell>
  );
}

function EditorWorkspace({
  activeFile,
  code,
  dirty,
  execution,
  fullscreen,
  language,
  languages,
  monacoTheme,
  outputHeight,
  running,
  saveError,
  saving,
  onCodeChange,
  onFullscreenChange,
  onLanguageChange,
  onOutputHeightChange,
  onReset,
  onRun,
  onSave,
  onSaveAs,
}) {
  return (
    <div className="glass h-full flex min-h-0 flex-col overflow-hidden rounded-xl">
      <div className="flex flex-wrap items-center gap-2 border-b border-border/60 px-3 py-2">
        <select
          value={language}
          onChange={(event) => onLanguageChange(event.target.value)}
          className="h-9 rounded-md border border-border bg-background/60 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {languages.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <span className="inline-flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
          <CheckCircle2 size={13} />
          <span className="truncate">
            {activeFile ? activeFile.name : "Untitled"}
            {dirty ? " · unsaved" : " · saved"}
          </span>
        </span>
        {saveError && (
          <span className="text-xs text-destructive">{saveError}</span>
        )}
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <Button size="sm" variant="outline" onClick={onReset}>
            <RotateCcw size={14} />
            Reset
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onSave}
            disabled={saving}
          >
            {saving ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Save size={14} />
            )}
            Save
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onSaveAs}
            disabled={saving}
          >
            <FilePlus2 size={14} />
            Save as
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onFullscreenChange(!fullscreen)}
          >
            {fullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </Button>
          <Button size="sm" onClick={onRun} disabled={running}>
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
          theme={monacoTheme}
          language={language}
          value={code}
          onChange={(value) => onCodeChange(value ?? "")}
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
          onHeightChange={onOutputHeightChange}
        />
      )}
    </div>
  );
}

function SavedFilesPanel({ activeFileId, error, files, status, onSelect }) {
  const loading = status === "loading";

  return (
    <Card className="min-h-0 overflow-hidden">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-medium">Saved files</h2>
        {loading && (
          <Loader2 size={14} className="animate-spin text-muted-foreground" />
        )}
      </div>

      {error && (
        <div className="mt-3 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {error}
        </div>
      )}

      <div className="mt-3 h-70 space-y-2 overflow-y-auto pr-1">
        {!loading && files.length === 0 && (
          <div className="rounded-lg border border-dashed border-border bg-background/30 p-4 text-sm text-muted-foreground">
            No saved playground files yet.
          </div>
        )}

        {files.map((file) => (
          <button
            key={file.id}
            type="button"
            onClick={() => onSelect(file.id)}
            className={cn(
              "w-full rounded-lg border p-3 text-left transition-colors hover:bg-secondary/60",
              activeFileId === file.id
                ? "border-primary/40 bg-primary/10"
                : "border-border bg-background/30",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{file.name}</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {file.language}
                </div>
              </div>
              {activeFileId === file.id && (
                <span className="rounded-md bg-primary/15 px-2 py-0.5 text-[11px] text-primary">
                  Active
                </span>
              )}
            </div>
            <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock3 size={12} />
              {formatSavedAt(file.updatedAt)}
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
}

function SaveFileModal({
  error,
  fileName,
  mode,
  saving,
  onClose,
  onFileNameChange,
  onSubmit,
}) {
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/60 p-4">
      <form
        className="glass w-full max-w-sm rounded-xl p-4"
        onSubmit={onSubmit}
      >
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold">
            {mode === "save" ? "Name this file" : "Save as"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
          >
            <X size={16} />
          </button>
        </div>

        <Input
          autoFocus
          className="mt-4"
          maxLength={120}
          placeholder="File name"
          value={fileName}
          onChange={(event) => onFileNameChange(event.target.value)}
        />

        {error && (
          <div className="mt-3 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {error}
          </div>
        )}

        <div className="mt-4 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving || !fileName.trim()}>
            {saving ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Save size={15} />
            )}
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}

function ConfirmReplaceModal({ onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/60 p-4">
      <div className="glass w-full max-w-md rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-warning/15 text-warning">
            <AlertTriangle size={17} />
          </div>
          <div>
            <h2 className="text-base font-semibold">
              Discard unsaved changes?
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Opening another file will replace the current playground content.
            </p>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Stay
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Discard and open
          </Button>
        </div>
      </div>
    </div>
  );
}
