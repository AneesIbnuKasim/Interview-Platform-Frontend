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
  CheckCheck,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Avatar } from "@/components/common/Avatar";
import { Input } from "@/components/common/Input";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logoutUser } from "@/features/auth/authSlice";
import {
  clearNotifications,
  fetchNotifications,
  markAllNotificationsRead,
  receiveNotification,
} from "@/features/notifications/notificationsSlice";
import { cn } from "@/lib/cn";
import { connectSocket, socketEvents } from "@/lib/socket";

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
  { to: "/playground", label: "Playground", icon: Code2 },
  { to: "/dashboard?view=team", view: "team", label: "Team", icon: Users },
  { to: "/profile", label: "Settings", icon: Settings },
];

export function AppShell({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const user = useAppSelector((s) => s.auth.user);
  const notifications = useAppSelector((s) => s.notifications.items);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_URL
  const dashboardView =
    new URLSearchParams(location.search).get("view") || "overview";
  const unreadCount = notifications.filter((notification) => {
    return !notification.read;
  }).length;
  const recentNotifications = useMemo(() => {
    return notifications.slice(0, 5);
  }, [notifications]);

  useEffect(() => {
    if (!user) return undefined;

    dispatch(fetchNotifications());

    const socket = connectSocket();
    if (!socket) return undefined;

    const handleNotification = (payload) => {
      if (payload?.notification) {
        dispatch(receiveNotification(payload.notification));
      }
    };

    socket.on(socketEvents.NOTIFICATION_NEW, handleNotification);

    return () => {
      socket.off(socketEvents.NOTIFICATION_NEW, handleNotification);
    };
  }, [dispatch, user]);

  async function handleLogout() {
    await dispatch(logoutUser());
    dispatch(clearNotifications());
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

  function toggleNotifications() {
    setNotificationsOpen((open) => {
      const nextOpen = !open;

      if (nextOpen && unreadCount > 0) {
        dispatch(markAllNotificationsRead());
      }

      return nextOpen;
    });
  }

  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className={cn(
          "hidden border-r border-border bg-card md:flex md:flex-col transition-all",
          collapsed ? "w-16" : "w-60",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <span className="grid h-8 w-8 place-items-center rounded-md border border-border bg-background">
              <Code2 size={16} />
            </span>
            {!collapsed && <span>Pairloop</span>}
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
              item.to === "/profile" || item.to === "/playground"
                ? location.pathname === item.to
                : location.pathname === "/dashboard" &&
                  dashboardView === item.view;

            return (
              <Link
                key={item.label}
                to={item.to}
                className={cn(
                  "group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-secondary/60 hover:text-foreground",
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
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
          >
            <LogOut size={16} />
            {!collapsed && "Log out"}
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/95 px-4 md:px-6">
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
                onClick={toggleNotifications}
                className="relative grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
              >
                <Bell size={16} />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
              {notificationsOpen && (
                <div className="glass absolute right-0 mt-2 w-80 rounded-lg p-2 text-sm">
                  <div className="flex items-center justify-between px-2 py-1.5">
                    <span className="text-xs font-medium text-muted-foreground">
                      Notifications
                    </span>
                  </div>
                  {recentNotifications.length === 0 ? (
                    <div className="px-2 py-4 text-xs text-muted-foreground">
                      No notifications yet.
                    </div>
                  ) : (
                    recentNotifications.map((notification) => (
                      <Link
                        key={notification.id}
                        to={
                          notification.roomId
                            ? `/room/${notification.roomId}`
                            : "/dashboard"
                        }
                        onClick={() => setNotificationsOpen(false)}
                        className={cn(
                          "block rounded-md px-2 py-2 transition-colors hover:bg-secondary/60",
                          !notification.read && "bg-primary/10",
                        )}
                      >
                        <div className="truncate font-medium">
                          {notification.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {notification.body}
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
                className="flex items-center gap-2 rounded-lg border border-border px-2 py-1 transition-colors hover:bg-secondary/60"
              >
                <Avatar
                  name={user?.name ?? "Guest"}
                  src={`${baseUrl}user?.avatar?.url`}
                  size={28}
                />
                <span className="hidden text-sm md:inline">
                  {user?.name ?? "Guest"}
                </span>
              </button>
              {menuOpen && (
                <div className="glass absolute right-0 mt-2 w-48 rounded-lg p-1 text-sm">
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-md px-3 py-2 hover:bg-secondary/60"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/playground"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-md px-3 py-2 hover:bg-secondary/60"
                  >
                    Playground
                  </Link>
                  <Link
                    to="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-md px-3 py-2 hover:bg-secondary/60"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full rounded-md px-3 py-2 text-left text-destructive hover:bg-secondary/60"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="min-w-0 flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
