import Editor from "@monaco-editor/react";
import { Check, Copy, Loader2, Maximize2, Minimize2, Play } from "lucide-react";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCode, setLanguage, markSaved, type Lang } from "@/features/editor/editorSlice";
import { toggleFullscreenEditor } from "@/features/ui/uiSlice";
import { Button } from "@/components/common/Button";

const langs: Lang[] = ["typescript", "javascript", "python", "go", "java", "cpp", "rust"];

export function CodeEditor({ roomId }: { roomId: string }) {
  const { language, code, saved, syncing } = useAppSelector(s => s.editor);
  const fullscreen = useAppSelector(s => s.ui.fullscreenEditor);
  const dispatch = useAppDispatch();
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(roomId);
    setCopied(true); setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div className="glass flex h-full min-h-0 flex-col overflow-hidden rounded-2xl">
      <div className="flex flex-wrap items-center gap-2 border-b border-border/60 px-3 py-2">
        <select
          value={language}
          onChange={e => dispatch(setLanguage(e.target.value as Lang))}
          className="h-8 rounded-lg border border-border bg-background/60 px-2 text-xs"
        >
          {langs.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        <button onClick={copy} className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border px-2.5 text-xs text-muted-foreground hover:text-foreground">
          {copied ? <Check size={12}/> : <Copy size={12}/>} {roomId}
        </button>
        <span className="text-xs text-muted-foreground">
          {syncing ? <span className="inline-flex items-center gap-1"><Loader2 size={12} className="animate-spin"/> syncing</span>
            : saved ? <span className="text-success">● saved</span> : <span className="text-warning">● unsaved</span>}
        </span>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => dispatch(toggleFullscreenEditor())}>
            {fullscreen ? <Minimize2 size={14}/> : <Maximize2 size={14}/>}
          </Button>
          <Button size="sm" onClick={() => dispatch(markSaved())}><Play size={14}/> Run</Button>
        </div>
      </div>
      <div className="min-h-0 flex-1">
        <Editor
          height="100%"
          theme="vs-dark"
          language={language}
          value={code}
          onChange={v => dispatch(setCode(v ?? ""))}
          options={{
            fontSize: 13,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            fontLigatures: true,
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            padding: { top: 12 },
          }}
          loading={<div className="grid h-full place-items-center text-muted-foreground"><Loader2 className="animate-spin" /></div>}
        />
      </div>
    </div>
  );
}
