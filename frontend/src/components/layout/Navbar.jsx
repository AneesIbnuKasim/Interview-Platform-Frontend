import { Link, NavLink } from "react-router-dom";
import { Code2, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/common/Button";

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="mx-auto mt-3 max-w-7xl px-4">
        <div className="glass flex h-14 items-center justify-between rounded-2xl px-4">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-accent">
              <Code2 size={16} />
            </span>
            <span className="text-gradient text-lg">Pairloop</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#features" className="hover:text-foreground transition">Features</a>
            <a href="#how" className="hover:text-foreground transition">How it works</a>
            <NavLink to="/dashboard" className="hover:text-foreground transition">Dashboard</NavLink>
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            <Link to="/login"><Button variant="ghost" size="sm">Log in</Button></Link>
            <Link to="/register"><Button size="sm">Get started</Button></Link>
          </div>
          <button className="md:hidden" onClick={() => setOpen(o => !o)} aria-label="Menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {open && (
          <div className="glass mt-2 flex flex-col gap-2 rounded-2xl p-4 md:hidden">
            <a href="#features" onClick={() => setOpen(false)}>Features</a>
            <a href="#how" onClick={() => setOpen(false)}>How it works</a>
            <Link to="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>
            <div className="mt-2 flex gap-2">
              <Link to="/login" className="flex-1"><Button variant="outline" size="sm" className="w-full">Log in</Button></Link>
              <Link to="/register" className="flex-1"><Button size="sm" className="w-full">Sign up</Button></Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
