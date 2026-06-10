import { Link, NavLink } from "react-router-dom";
import { Code2, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/common/Button";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("pairloop.user"))?.id;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <span className="grid h-8 w-8 place-items-center rounded-md border border-border bg-card">
              <Code2 size={16} />
            </span>
            <span className="text-base">Pairloop</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#features" className="transition hover:text-foreground">
              Features
            </a>
            <a href="#how" className="transition hover:text-foreground">
              How it works
            </a>
            <NavLink
              to="/dashboard"
              className="transition hover:text-foreground"
            >
              Dashboard
            </NavLink>
          </nav>
          {user ? (
            <div>Logout</div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Get started</Button>
              </Link>
            </div>
          )}
          <button
            className="grid h-9 w-9 place-items-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {open && (
          <div className="border-t border-border py-3 text-sm md:hidden">
            <div className="flex flex-col gap-2 text-muted-foreground">
              <a href="#features" onClick={() => setOpen(false)}>
                Features
              </a>
              <a href="#how" onClick={() => setOpen(false)}>
                How it works
              </a>
              <Link to="/dashboard" onClick={() => setOpen(false)}>
                Dashboard
              </Link>
            </div>
            <div className="mt-2 flex gap-2">
              <Link to="/login" className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  Log in
                </Button>
              </Link>
              <Link to="/register" className="flex-1">
                <Button size="sm" className="w-full">
                  Sign up
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
