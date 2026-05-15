import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Code2,
  LayoutDashboard,
  Settings,
  Users,
  Calendar,
  LogOut,
  ChevronLeft,
  Bell,
  Search,
} from "lucide-react";
import { useState } from "react";
import { Avatar } from "@/components/common/Avatar";
import { Input } from "@/components/common/Input";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logoutUser } from "@/features/auth/authSlice";
import { cn } from "@/lib/cn";

const nav = [
  {
    to: "/dashboard",
    view: "overview",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    to: "/dashboard?view=interviews",
    view: "interviews",
    label: "Interviews",
    icon: Calendar,
  },
  { to: "/dashboard?view=team", view: "team", label: "Team", icon: Users },
  { to: "/profile", label: "Settings", icon: Settings },
];

export function AppShell({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const user = useAppSelector((s) => s.auth.user);
  const rooms = useAppSelector((s) => s.room.rooms);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const dashboardView =
    new URLSearchParams(location.search).get("view") || "overview";
  const activeRooms = rooms.filter((room) => room.status === "active");
  const recentRooms = rooms.slice(0, 3);

  async function handleLogout() {
    await dispatch(logoutUser());
    navigate("/");
  }

  function submitSearch(event) {
    event.preventDefault();

    const query = search.trim();
    navigate(
      query
        ? `/dashboard?view=interviews&q=${encodeURIComponent(query)}`
        : "/dashboard?view=interviews",
    );
  }

  return (
    <div className="flex min-h-screen">
      <aside
        className={cn(
          "hidden border-r border-border bg-background/40 backdrop-blur md:flex md:flex-col transition-all",
          collapsed ? "w-16" : "w-60",
        )}
      >
        <div className="flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-accent">
              <Code2 size={16} />
            </span>
            {!collapsed && <span className="text-gradient">Pairloop</span>}
          </Link>
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft
              size={16}
              className={cn("transition", collapsed && "rotate-180")}
            />
          </button>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          {nav.map((item) => {
            const isActive =
              item.to === "/profile"
                ? location.pathname === "/profile"
                : location.pathname === "/dashboard" &&
                  dashboardView === item.view;

            return (
              <Link
                key={item.label}
                to={item.to}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-secondary/60 hover:text-foreground",
                  isActive
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground",
                )}
              >
                <item.icon size={16} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
          >
            <LogOut size={16} />
            {!collapsed && "Log out"}
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/60 px-4 backdrop-blur md:px-6">
          <form className="relative w-full max-w-sm" onSubmit={submitSearch}>
            <Search
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder="Search rooms, candidates…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-9 pl-9 text-sm"
            />
          </form>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen((open) => !open)}
                className="relative grid h-9 w-9 place-items-center rounded-xl border border-border text-muted-foreground hover:text-foreground"
              >
                <Bell size={16} />
                {activeRooms.length > 0 && (
                  <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
                )}
              </button>
              {notificationsOpen && (
                <div className="glass absolute right-0 mt-2 w-80 rounded-xl p-2 text-sm">
                  <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                    Notifications
                  </div>
                  {recentRooms.length === 0 ? (
                    <div className="px-2 py-3 text-xs text-muted-foreground">
                      No room activity yet.
                    </div>
                  ) : (
                    recentRooms.map((room) => (
                      <Link
                        key={room.id}
                        to={`/room/${room.id}`}
                        onClick={() => setNotificationsOpen(false)}
                        className="block rounded-lg px-2 py-2 hover:bg-secondary/60"
                      >
                        <div className="truncate font-medium">{room.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {room.status || "active"} interview room
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>
            <div className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 rounded-xl border border-border px-2 py-1"
              >
                <Avatar name={user?.name ?? "Guest"} size={28} />
                <span className="hidden text-sm md:inline">
                  {user?.name ?? "Guest"}
                </span>
              </button>
              {menuOpen && (
                <div className="glass absolute right-0 mt-2 w-48 rounded-xl p-1 text-sm">
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 hover:bg-secondary/60"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 hover:bg-secondary/60"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full rounded-lg px-3 py-2 text-left text-destructive hover:bg-secondary/60"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="min-w-0 flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
