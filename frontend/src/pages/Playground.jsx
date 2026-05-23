import Editor from "@monaco-editor/react";
import {
  CheckCircle2,
  Code2,
  Loader2,
  Play,
  RotateCcw,
  Terminal,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { ExecutionOutput } from "@/components/editor/ExecutionOutput";
import { editorStarterCode } from "@/features/editor/editorSlice";
import { editorService } from "@/services/editorService";
import { useAppSelector } from "@/store/hooks";

const languages = [
  "typescript",
  "javascript",
  "python",
  "go",
  "java",
  "cpp",
  "rust",
];

export default function PlaygroundPage() {
  const editorThemePreference = useAppSelector((state) => {
    return state.auth.user?.preferences?.defaultEditorTheme || "dark";
  });
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(editorStarterCode.javascript);
  const [stdin, setStdin] = useState("");
  const [running, setRunning] = useState(false);
  const [execution, setExecution] = useState(null);
  const [outputHeight, setOutputHeight] = useState(176);
  const [systemPrefersDark, setSystemPrefersDark] = useState(true);
  const latestCode = useRef(code);

  useEffect(() => {
    latestCode.current = code;
  }, [code]);

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

  const monacoTheme = useMemo(() => {
    if (editorThemePreference === "system") {
      return systemPrefersDark ? "vs-dark" : "light";
    }

    return editorThemePreference === "light" ? "light" : "vs-dark";
  }, [editorThemePreference, systemPrefersDark]);

  function changeLanguage(nextLanguage) {
    setLanguage(nextLanguage);
    setCode(editorStarterCode[nextLanguage] ?? "");
    setExecution(null);
  }

  function resetCode() {
    setCode(editorStarterCode[language] ?? "");
    setExecution(null);
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

  return (
    <AppShell>
      <div className="flex h-[calc(100vh-8rem)] min-h-[680px] flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground">
              <Code2 size={13} />
              Practice workspace
            </div>
            <h1 className="mt-3 text-2xl font-semibold">Code playground</h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Write and run snippets before interviews.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={resetCode}>
              <RotateCcw size={15} />
              Reset
            </Button>
            <Button onClick={runCode} disabled={running}>
              {running ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Play size={15} />
              )}
              Run
            </Button>
          </div>
        </div>

        <div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="glass flex min-h-0 flex-col overflow-hidden rounded-xl">
            <div className="flex flex-wrap items-center gap-2 border-b border-border/60 px-3 py-2">
              <select
                value={language}
                onChange={(event) => changeLanguage(event.target.value)}
                className="h-9 rounded-md border border-border bg-background/60 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {languages.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <CheckCircle2 size={13} />
                Local practice, not synced to rooms
              </span>
            </div>

            <div className="min-h-0 flex-1">
              <Editor
                height="100%"
                theme={monacoTheme}
                language={language}
                value={code}
                onChange={(value) => setCode(value ?? "")}
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

          <aside className="grid min-h-0 gap-4 xl:grid-rows-[auto_1fr]">
            <Card>
              <div className="flex items-center gap-2 text-sm font-medium">
                <Terminal size={15} />
                Standard input
              </div>
              <textarea
                value={stdin}
                onChange={(event) => setStdin(event.target.value)}
                placeholder="Optional stdin for your program"
                className="mt-3 h-36 w-full resize-none rounded-lg border border-border bg-background/60 p-3 font-mono text-xs leading-5 outline-none focus:ring-2 focus:ring-ring"
              />
            </Card>

            <Card className="min-h-0">
              <h2 className="text-sm font-medium">Session</h2>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background/40 px-3 py-2">
                  <span className="text-muted-foreground">Scope</span>
                  <span>Private</span>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background/40 px-3 py-2">
                  <span className="text-muted-foreground">Storage</span>
                  <span>Not saved</span>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background/40 px-3 py-2">
                  <span className="text-muted-foreground">Timeout</span>
                  <span>5s</span>
                </div>
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}
