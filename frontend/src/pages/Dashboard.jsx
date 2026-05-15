import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  Mail,
  Plus,
  Search,
  Users,
  Video,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Avatar } from "@/components/common/Avatar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  createRoom,
  fetchRooms,
  joinRoomByCode,
} from "@/features/room/roomSlice";

const views = ["overview", "interviews", "team"];
const statusFilters = ["all", "active", "waiting", "ended"];

function formatRoomDate(room) {
  const value =
    room.scheduledAt || room.updatedAt || room.startedAt || room.createdAt;
  if (!value) return "Recently";

  return new Date(value).toLocaleDateString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function activeParticipants(room) {
  return (room.participants || []).filter((participant) => {
    return participant.status !== "left";
  });
}

function activeParticipantNames(room) {
  const names = activeParticipants(room).map((participant) => participant.name);
  return names.length ? names : ["You"];
}

function roomMatchesQuery(room, query) {
  if (!query) return true;

  const value = query.toLowerCase();
  const participantNames = (room.participants || [])
    .map((participant) => participant.name)
    .join(" ");

  return [room.title, room.code, room.id, room.candidateName, participantNames]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .includes(value);
}

function collectTeamMembers(rooms) {
  const members = new Map();

  rooms.forEach((room) => {
    (room.participants || []).forEach((participant) => {
      const key = participant.id || participant.email || participant.name;
      const current = members.get(key) || {
        id: key,
        name: participant.name,
        role: participant.role || "participant",
        rooms: 0,
        activeRooms: 0,
        lastSeen: participant.leftAt || participant.joinedAt,
      };

      current.rooms += 1;
      if (participant.status !== "left") {
        current.activeRooms += 1;
      }
      current.lastSeen =
        participant.leftAt || participant.joinedAt || current.lastSeen;
      members.set(key, current);
    });
  });

  return Array.from(members.values());
}

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { error, rooms, status } = useAppSelector((state) => state.room);
  const [join, setJoin] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [copiedRoomId, setCopiedRoomId] = useState(null);
  const busy = status === "loading";
  const currentView = views.includes(searchParams.get("view"))
    ? searchParams.get("view")
    : "overview";
  const query = searchParams.get("q") || "";
  const statusFilter = searchParams.get("status") || "all";

  useEffect(() => {
    dispatch(fetchRooms());
  }, [dispatch]);

  function setView(view, extra = {}) {
    setSearchParams({
      view,
      ...(query ? { q: query } : {}),
      ...(statusFilter !== "all" ? { status: statusFilter } : {}),
      ...extra,
    });
  }

  function updateQuery(value) {
    setSearchParams({
      view: "interviews",
      ...(value ? { q: value } : {}),
      ...(statusFilter !== "all" ? { status: statusFilter } : {}),
    });
  }

  function updateStatusFilter(value) {
    setSearchParams({
      view: "interviews",
      ...(query ? { q: query } : {}),
      ...(value !== "all" ? { status: value } : {}),
    });
  }

  async function startRoom() {
    try {
      const result = await dispatch(createRoom()).unwrap();
      navigate(`/room/${result.id}`);
    } catch {
      // Error is rendered from Redux state.
    }
  }

  async function joinRoom() {
    if (!join.trim()) return;

    try {
      const result = await dispatch(
        joinRoomByCode({ roomCode: join.trim() }),
      ).unwrap();
      navigate(`/room/${result.id}`);
    } catch {
      // Error is rendered from Redux state.
    }
  }

  function inviteTeammate(event) {
    event.preventDefault();
    if (!inviteEmail.trim()) return;

    const subject = encodeURIComponent("Join me on Pairloop");
    const body = encodeURIComponent(
      `I invited you to collaborate on Pairloop: ${window.location.origin}/dashboard`,
    );
    window.location.href = `mailto:${inviteEmail.trim()}?subject=${subject}&body=${body}`;
  }

  async function copyRoomCode(room) {
    const value = room.code || room.id;
    await navigator.clipboard?.writeText(value);
    setCopiedRoomId(room.id);
    window.setTimeout(() => setCopiedRoomId(null), 1200);
  }

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const statusMatches =
        statusFilter === "all" || (room.status || "active") === statusFilter;
      return statusMatches && roomMatchesQuery(room, query);
    });
  }, [query, rooms, statusFilter]);

  const teamMembers = useMemo(() => collectTeamMembers(rooms), [rooms]);
  const upcomingRooms = rooms
    .filter((room) => room.status === "active" || room.scheduledAt)
    .slice(0, 3);

  const stats = [
    { label: "Rooms", value: String(rooms.length), delta: "live" },
    {
      label: "Active rooms",
      value: String(rooms.filter((room) => room.status === "active").length),
      delta: "now",
    },
    {
      label: "Participants",
      value: String(
        rooms.reduce((sum, room) => sum + (room.participants?.length || 0), 0),
      ),
      delta: "total",
    },
    {
      label: "Completed",
      value: String(rooms.filter((room) => room.status === "ended").length),
      delta: "saved",
    },
  ];

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold md:text-3xl">
              Good to see you
            </h1>
            <p className="text-sm text-muted-foreground">
              Pick up where you left off, or start a new interview.
            </p>
          </div>
          <Button onClick={startRoom} disabled={busy}>
            <Plus size={16} /> {busy ? "Creating..." : "New room"}
          </Button>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {views.map((view) => (
            <button
              key={view}
              type="button"
              onClick={() => setView(view)}
              className={
                "rounded-lg px-3 py-1.5 text-sm capitalize transition " +
                (currentView === view
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground")
              }
            >
              {view}
            </button>
          ))}
        </div>

        {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

        {currentView === "overview" && (
          <OverviewView
            stats={stats}
            rooms={rooms}
            upcomingRooms={upcomingRooms}
            join={join}
            busy={busy}
            onJoinChange={setJoin}
            onJoinRoom={joinRoom}
            onShowAll={() => setView("interviews", { status: "all" })}
            onInviteClick={() => setView("team")}
          />
        )}

        {currentView === "interviews" && (
          <InterviewsView
            rooms={filteredRooms}
            query={query}
            statusFilter={statusFilter}
            copiedRoomId={copiedRoomId}
            onQueryChange={updateQuery}
            onStatusChange={updateStatusFilter}
            onCopyRoomCode={copyRoomCode}
          />
        )}

        {currentView === "team" && (
          <TeamView
            members={teamMembers}
            inviteEmail={inviteEmail}
            onInviteEmailChange={setInviteEmail}
            onInvite={inviteTeammate}
          />
        )}
      </div>
    </AppShell>
  );
}

function OverviewView({
  stats,
  rooms,
  upcomingRooms,
  join,
  busy,
  onJoinChange,
  onJoinRoom,
  onShowAll,
  onInviteClick,
}) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                {stat.label}
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-semibold">{stat.value}</span>
                <span className="text-xs text-success">{stat.delta}</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent rooms</h2>
            <button
              type="button"
              onClick={onShowAll}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              See all
            </button>
          </div>
          <RoomList rooms={rooms.slice(0, 5)} emptyText="No rooms yet." />
        </Card>

        <div className="flex flex-col gap-4">
          <Card>
            <h2 className="text-lg font-semibold">Join a room</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Paste a room code to jump in instantly.
            </p>
            <form
              className="mt-3 flex gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                onJoinRoom();
              }}
            >
              <Input
                placeholder="e.g. 9f8a"
                value={join}
                onChange={(event) => onJoinChange(event.target.value)}
              />
              <Button type="submit" disabled={!join || busy}>
                Join
              </Button>
            </form>
          </Card>
          <Card>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Upcoming</h2>
              <Clock size={14} className="text-muted-foreground" />
            </div>
            <ul className="space-y-3">
              {upcomingRooms.length === 0 && (
                <li className="rounded-xl bg-background/50 p-3 text-sm text-muted-foreground">
                  No upcoming interviews yet.
                </li>
              )}
              {upcomingRooms.map((room) => (
                <li key={room.id} className="rounded-xl bg-background/50 p-3">
                  <div className="truncate text-sm font-medium">
                    {room.title}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatRoomDate(room)}
                  </div>
                </li>
              ))}
            </ul>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-3 w-full"
              onClick={onInviteClick}
            >
              <Users size={14} /> Invite teammates
            </Button>
          </Card>
        </div>
      </div>
    </>
  );
}

function InterviewsView({
  rooms,
  query,
  statusFilter,
  copiedRoomId,
  onQueryChange,
  onStatusChange,
  onCopyRoomCode,
}) {
  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Interviews</h2>
          <p className="text-sm text-muted-foreground">
            Search, filter, reopen rooms, and copy invite codes.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Search"
              className="h-9 w-56 pl-9"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(event) => onStatusChange(event.target.value)}
            className="h-9 rounded-lg border border-border bg-background/40 px-3 text-sm"
          >
            {statusFilters.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>
      <RoomList
        rooms={rooms}
        emptyText="No interviews match your filters."
        copiedRoomId={copiedRoomId}
        onCopyRoomCode={onCopyRoomCode}
      />
    </Card>
  );
}

function TeamView({ members, inviteEmail, onInviteEmailChange, onInvite }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Team</h2>
          <p className="text-sm text-muted-foreground">
            People who have participated in your interview rooms.
          </p>
        </div>
        <ul className="divide-y divide-border">
          {members.length === 0 && (
            <li className="py-6 text-sm text-muted-foreground">
              Team activity will appear after people join rooms.
            </li>
          )}
          {members.map((member) => (
            <li
              key={member.id}
              className="flex flex-wrap items-center justify-between gap-3 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <Avatar name={member.name} size={36} />
                <div className="min-w-0">
                  <div className="truncate font-medium">{member.name}</div>
                  <div className="text-xs capitalize text-muted-foreground">
                    {member.role} · {member.rooms} rooms
                  </div>
                </div>
              </div>
              <span className="rounded-lg bg-secondary px-2.5 py-1 text-xs text-muted-foreground">
                {member.activeRooms > 0 ? "Active" : "Past participant"}
              </span>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold">Invite teammate</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Send a quick email invite to bring another interviewer in.
        </p>
        <form className="mt-4 space-y-3" onSubmit={onInvite}>
          <Input
            type="email"
            value={inviteEmail}
            onChange={(event) => onInviteEmailChange(event.target.value)}
            placeholder="teammate@company.com"
            required
          />
          <Button type="submit" className="w-full">
            <Mail size={15} /> Compose invite
          </Button>
        </form>
      </Card>
    </div>
  );
}

function RoomList({ rooms, emptyText, copiedRoomId, onCopyRoomCode }) {
  return (
    <ul className="divide-y divide-border">
      {rooms.length === 0 && (
        <li className="py-6 text-sm text-muted-foreground">{emptyText}</li>
      )}
      {rooms.map((room) => (
        <li
          key={room.id}
          className="flex flex-wrap items-center justify-between gap-3 py-3"
        >
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-primary">
              <Video size={16} />
            </span>
            <div className="min-w-0">
              <div className="truncate font-medium">{room.title}</div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Calendar size={12} /> {formatRoomDate(room)}
                </span>
                <span className="capitalize">· {room.status || "active"}</span>
                {(room.code || room.id) && (
                  <span className="font-mono">· {room.code || room.id}</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex -space-x-2">
              {activeParticipantNames(room)
                .slice(0, 4)
                .map((name) => (
                  <Avatar
                    key={name}
                    name={name}
                    size={26}
                    className="ring-2 ring-background"
                  />
                ))}
            </div>
            {onCopyRoomCode && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => onCopyRoomCode(room)}
              >
                {copiedRoomId === room.id ? (
                  <CheckCircle2 size={14} />
                ) : (
                  <Copy size={14} />
                )}
                Code
              </Button>
            )}
            <Link to={`/room/${room.id}`}>
              <Button size="sm" variant="outline">
                Open <ArrowRight size={14} />
              </Button>
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}
