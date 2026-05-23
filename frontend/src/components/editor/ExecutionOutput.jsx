import { Terminal } from "lucide-react";
import { useCallback } from "react";

const outputMinHeight = 120;
const outputMaxHeight = 420;

export function ExecutionOutput({ execution, height, onHeightChange }) {
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
          "min-h-0 flex-1 overflow-auto whitespace-pre-wrap px-3 pb-3 font-mono text-xs leading-5 " +
          (failed ? "text-destructive" : "text-foreground")
        }
      >
        {output}
      </pre>
    </div>
  );
}
