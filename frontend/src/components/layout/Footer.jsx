import { Code2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 py-10 text-sm text-muted-foreground">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-md border border-border bg-card text-foreground">
            <Code2 size={14} />
          </span>
          <span className="font-semibold text-foreground">Pairloop</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
        <div className="flex gap-6">
          <a href="#features" className="hover:text-foreground">
            Features
          </a>
          <a href="#how" className="hover:text-foreground">
            How it works
          </a>
          <a href="mailto:hello@pairloop.dev" className="hover:text-foreground">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
