import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  CalendarPlus,
  CheckCircle2,
  Clock,
  Copy,
  Mail,
  Plus,
  Search,
  Users,
  Video,
  X,
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
  updateRoomStatus,
} from "@/features/room/roomSlice";
import {
  clearTeamInviteFeedback,
  fetchTeamInvites,
  resendTeamInvite,
  sendTeamInvite,
} from "@/features/teamInvites/teamInvitesSlice";

const views = ["overview", "interviews", "team"];
const statusFilters = ["all", "active", "waiting", "ended"];
const defaultScheduleForm = {
  title: "",
  candidateName: "",
  candidateEmail: "",
  interviewType: "Coding Interview",
  scheduledAt: "",
};

function formatDatetimeLocal(date) {
  const value = new Date(date);
  const pad = (item) => String(item).padStart(2, "0");

  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}T${pad(value.getHours())}:${pad(value.getMinutes())}`;
}

function defaultScheduledAt() {
  const value = new Date(Date.now() + 60 * 60 * 1000);
  const nextQuarter = Math.ceil(value.getMinutes() / 15) * 15;
  value.setMinutes(nextQuarter, 0, 0);
  return formatDatetimeLocal(value);
}

function compactSchedulePayload(form) {
  return Object.fromEntries(
    Object.entries({
      ...form,
      scheduledAt: new Date(form.scheduledAt).toISOString(),
    }).filter(([, value]) => value !== ""),
  );
}

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

function formatInviteDate(value) {
  if (!value) return "Not sent yet";

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

function statusBadgeClass(status = "active") {
  const base =
    "inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium capitalize";

  if (status === "active") {
    return `${base} border-success/25 bg-success/10 text-success`;
  }

  if (status === "waiting") {
    return `${base} border-warning/25 bg-warning/10 text-warning`;
  }

  if (status === "ended") {
    return `${base} border-border bg-secondary text-muted-foreground`;
  }

  return `${base} border-border bg-secondary text-muted-foreground`;
}

function inviteStatusMeta(invitation) {
  if (invitation.emailSkipped) {
    return {
      label: "SMTP skipped",
      className: "border-warning/25 bg-warning/10 text-warning",
    };
  }

  if (invitation.status === "failed") {
    return {
      label: "Failed",
      className: "border-destructive/25 bg-destructive/10 text-destructive",
    };
  }

  return {
    label: "Sent",
    className: "border-success/25 bg-success/10 text-success",
  };
}

function roomMatchesQuery(room, query) {
  if (!query) return true;

  const value = query.toLowerCase();
  const participantNames = (room.participants || [])
    .map((participant) => participant.name)
    .join(" ");

  return [
    room.title,
    room.code,
    room.id,
    room.candidateName,
    room.candidateEmail,
    room.interviewType,
    participantNames,
  ]
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
  const teamInvites = useAppSelector((state) => state.teamInvites);
  const [join, setJoin] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [copiedRoomId, setCopiedRoomId] = useState(null);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduledRoom, setScheduledRoom] = useState(null);
  const [scheduleForm, setScheduleForm] = useState(() => ({
    ...defaultScheduleForm,
    scheduledAt: defaultScheduledAt(),
  }));
  const busy = status === "loading";
  const currentView = views.includes(searchParams.get("view"))
    ? searchParams.get("view")
    : "overview";
  const query = searchParams.get("q") || "";
  const statusFilter = searchParams.get("status") || "all";

  useEffect(() => {
    dispatch(fetchRooms());
  }, [dispatch]);

  useEffect(() => {
    if (currentView === "team") {
      dispatch(fetchTeamInvites());
    }
  }, [currentView, dispatch]);

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
      console.log("Error");
    }
  }

  function openSchedule() {
    setScheduledRoom(null);
    setScheduleForm((current) => ({
      ...defaultScheduleForm,
      ...current,
      scheduledAt: current.scheduledAt || defaultScheduledAt(),
    }));
    setScheduleOpen(true);
  }

  function closeSchedule() {
    setScheduleOpen(false);
    setScheduledRoom(null);
  }

  function updateScheduleField(field, value) {
    setScheduleForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function scheduleInterview(event) {
    event.preventDefault();

    try {
      const room = await dispatch(
        createRoom(compactSchedulePayload(scheduleForm)),
      ).unwrap();

      setScheduledRoom(room);
      setScheduleForm({
        ...defaultScheduleForm,
        scheduledAt: defaultScheduledAt(),
      });
      setView("interviews", { status: "waiting" });
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
      navigate(`/room/${result.room.id}`);
    } catch {
      // Error is rendered from Redux state.
    }
  }

  async function inviteTeammate(event) {
    event.preventDefault();
    if (!inviteEmail.trim()) return;

    try {
      await dispatch(sendTeamInvite({ email: inviteEmail.trim() })).unwrap();
      setInviteEmail("");
    } catch {
      dispatch(fetchTeamInvites());
      // Error is rendered from Redux state.
    }
  }

  async function resendInvite(invitationId) {
    try {
      await dispatch(resendTeamInvite(invitationId)).unwrap();
    } catch {
      dispatch(fetchTeamInvites());
    }
  }

  async function copyRoomCode(room) {
    const value = room.code || room.id;
    await navigator.clipboard?.writeText(value);
    setCopiedRoomId(room.id);
    window.setTimeout(() => setCopiedRoomId(null), 1200);
  }

  async function cancelScheduledRoom(room) {
    try {
      await dispatch(
        updateRoomStatus({ roomId: room.id, status: "archived" }),
      ).unwrap();
    } catch {
      // Error is rendered from Redux state.
    }
  }

  function emailRoomInvite(room) {
    const to = room.candidateEmail || "";
    const subject = encodeURIComponent(`Pairloop interview · ${room.title}`);
    const body = encodeURIComponent(
      [
        `Hi${room.candidateName ? ` ${room.candidateName}` : ""},`,
        "",
        `Your interview is scheduled for ${formatRoomDate(room)}.`,
        `Room code: ${room.code || room.id}`,
        `Join here: ${window.location.origin}/room/${room.id}`,
      ].join("\n"),
    );

    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  }

  function clearInviteFeedback() {
    dispatch(clearTeamInviteFeedback());
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
    .filter((room) => room.scheduledAt && room.status !== "archived")
    .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt))
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
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Good to see you
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Pick up where you left off, or start a new interview.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={openSchedule} disabled={busy}>
              <CalendarPlus size={16} /> Schedule
            </Button>
            <Button onClick={startRoom} disabled={busy}>
              <Plus size={16} /> {busy ? "Creating..." : "New room"}
            </Button>
          </div>
        </div>

        <div className="mb-6 inline-flex rounded-lg border border-border bg-card p-1">
          {views.map((view) => (
            <button
              key={view}
              type="button"
              onClick={() => setView(view)}
              className={
                "rounded-md px-3 py-1.5 text-sm capitalize transition-colors " +
                (currentView === view
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground")
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
            onScheduleClick={openSchedule}
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
            onEmailRoomInvite={emailRoomInvite}
            onCancelScheduledRoom={cancelScheduledRoom}
          />
        )}

        {currentView === "team" && (
          <TeamView
            members={teamMembers}
            invites={teamInvites.items}
            inviteEmail={inviteEmail}
            inviteError={teamInvites.error}
            inviteStatus={teamInvites.status}
            lastSentInvite={teamInvites.lastSent}
            sendingInvite={teamInvites.sending}
            resendingInviteId={teamInvites.resendingId}
            onClearInviteFeedback={clearInviteFeedback}
            onInviteEmailChange={setInviteEmail}
            onInvite={inviteTeammate}
            onResendInvite={resendInvite}
          />
        )}

        {scheduleOpen && (
          <ScheduleInterviewModal
            form={scheduleForm}
            scheduledRoom={scheduledRoom}
            busy={busy}
            onClose={closeSchedule}
            onSubmit={scheduleInterview}
            onChange={updateScheduleField}
            onCopyRoomCode={copyRoomCode}
            onEmailRoomInvite={emailRoomInvite}
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
  onScheduleClick,
}) {
  return (
    <>
      <div className="grid gap-3 md:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="p-4">
              <div className="text-xs font-medium text-muted-foreground">
                {stat.label}
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-semibold tabular-nums">
                  {stat.value}
                </span>
                <span className="text-xs text-success">{stat.delta}</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold">Recent rooms</h2>
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
            <h2 className="text-base font-semibold">Join a room</h2>
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
              <h2 className="text-base font-semibold">Upcoming</h2>
              <Clock size={14} className="text-muted-foreground" />
            </div>
            <ul className="space-y-3">
              {upcomingRooms.length === 0 && (
                <li className="rounded-lg border border-dashed border-border bg-background/35 p-3 text-sm text-muted-foreground">
                  No upcoming interviews yet.
                </li>
              )}
              {upcomingRooms.map((room) => (
                <li
                  key={room.id}
                  className="rounded-lg border border-border bg-background/35 p-3"
                >
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
              onClick={onScheduleClick}
            >
              <CalendarPlus size={14} /> Schedule interview
            </Button>
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
  onEmailRoomInvite,
  onCancelScheduledRoom,
}) {
  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">Interviews</h2>
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
            className="h-9 rounded-lg border border-border bg-background/60 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
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
        onEmailRoomInvite={onEmailRoomInvite}
        onCancelScheduledRoom={onCancelScheduledRoom}
      />
    </Card>
  );
}

function TeamView({
  members,
  invites,
  inviteEmail,
  inviteError,
  inviteStatus,
  lastSentInvite,
  resendingInviteId,
  sendingInvite,
  onClearInviteFeedback,
  onInviteEmailChange,
  onInvite,
  onResendInvite,
}) {
  const loadingInvites = inviteStatus === "loading";

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <div className="mb-4">
          <h2 className="text-base font-semibold">Team</h2>
          <p className="text-sm text-muted-foreground">
            People who have participated in your interview rooms.
          </p>
        </div>
        <ul className="divide-y divide-border">
          {members.length === 0 && (
            <li className="rounded-lg border border-dashed border-border bg-background/30 p-6 text-sm text-muted-foreground">
              Team activity will appear after people join rooms.
            </li>
          )}
          {members.map((member) => (
            <li
              key={member.id}
              className="flex flex-wrap items-center justify-between gap-3 py-3.5"
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
              <span className="rounded-md border border-border bg-secondary px-2.5 py-1 text-xs text-muted-foreground">
                {member.activeRooms > 0 ? "Active" : "Past participant"}
              </span>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <h2 className="text-base font-semibold">Invite teammate</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Send a quick email invite to bring another interviewer in.
        </p>
        <form className="mt-4 space-y-3" onSubmit={onInvite}>
          <Input
            type="email"
            value={inviteEmail}
            onChange={(event) => {
              onClearInviteFeedback();
              onInviteEmailChange(event.target.value);
            }}
            placeholder="teammate@company.com"
            required
          />
          {inviteError && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {inviteError}
            </div>
          )}
          {lastSentInvite && (
            <div className="rounded-lg border border-success/25 bg-success/10 px-3 py-2 text-xs text-success">
              {lastSentInvite.emailSkipped
                ? "Invite saved. SMTP is not configured, so no email was sent."
                : "Invite email sent."}
            </div>
          )}
          <Button
            type="submit"
            className="w-full"
            disabled={sendingInvite || !inviteEmail.trim()}
          >
            <Mail size={15} />
            {sendingInvite ? "Sending..." : "Send invite"}
          </Button>
        </form>
        <div className="mt-5 border-t border-border pt-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-medium">Recent invites</h3>
            {loadingInvites && (
              <span className="text-xs text-muted-foreground">Loading...</span>
            )}
          </div>
          <ul className="space-y-2">
            {invites.length === 0 && !loadingInvites && (
              <li className="rounded-lg border border-dashed border-border bg-background/30 p-3 text-xs text-muted-foreground">
                Sent teammate invites will appear here.
              </li>
            )}
            {invites.map((invitation) => {
              const status = inviteStatusMeta(invitation);

              return (
                <li
                  key={invitation.id}
                  className="rounded-lg border border-border bg-background/30 p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">
                        {invitation.inviteeEmail}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {formatInviteDate(invitation.sentAt)}
                      </div>
                    </div>
                    <span
                      className={
                        "shrink-0 rounded-md border px-2 py-0.5 text-[11px] font-medium " +
                        status.className
                      }
                    >
                      {status.label}
                    </span>
                  </div>
                  {invitation.lastError && (
                    <div className="mt-2 text-xs text-destructive">
                      {invitation.lastError}
                    </div>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-3 w-full"
                    onClick={() => onResendInvite(invitation.id)}
                    disabled={resendingInviteId === invitation.id}
                  >
                    {resendingInviteId === invitation.id
                      ? "Resending..."
                      : "Resend"}
                  </Button>
                </li>
              );
            })}
          </ul>
        </div>
      </Card>
    </div>
  );
}

function ScheduleInterviewModal({
  form,
  scheduledRoom,
  busy,
  onClose,
  onSubmit,
  onChange,
  onCopyRoomCode,
  onEmailRoomInvite,
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <div className="glass w-full max-w-2xl rounded-xl">
        <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold">Schedule interview</h2>
            <p className="text-sm text-muted-foreground">
              Create a room code now and keep it waiting until interview time.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        {scheduledRoom ? (
          <div className="space-y-4 p-5">
            <div className="rounded-lg border border-success/30 bg-success/10 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-success">
                <CheckCircle2 size={16} />
                Interview scheduled
              </div>
              <div className="mt-2 text-sm">
                {scheduledRoom.title} · {formatRoomDate(scheduledRoom)}
              </div>
              <div className="mt-1 font-mono text-sm text-muted-foreground">
                Room code {scheduledRoom.code || scheduledRoom.id}
              </div>
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onCopyRoomCode(scheduledRoom)}
              >
                <Copy size={15} /> Copy code
              </Button>
              {scheduledRoom.candidateEmail && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onEmailRoomInvite(scheduledRoom)}
                >
                  <Mail size={15} /> Email candidate
                </Button>
              )}
              <Link to={`/room/${scheduledRoom.id}`}>
                <Button type="button">
                  Open room <ArrowRight size={15} />
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <form className="space-y-4 p-5" onSubmit={onSubmit}>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label
                  className="text-xs text-muted-foreground"
                  htmlFor="title"
                >
                  Interview title
                </label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(event) => onChange("title", event.target.value)}
                  placeholder="Senior frontend screen"
                  className="mt-1"
                  maxLength={120}
                />
              </div>
              <div>
                <label
                  className="text-xs text-muted-foreground"
                  htmlFor="interviewType"
                >
                  Interview type
                </label>
                <select
                  id="interviewType"
                  value={form.interviewType}
                  onChange={(event) =>
                    onChange("interviewType", event.target.value)
                  }
                  className="mt-1 h-10 w-full rounded-lg border border-border bg-background/60 px-3 text-sm text-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="Coding Interview">Coding Interview</option>
                  <option value="System Design">System Design</option>
                  <option value="Frontend Interview">Frontend Interview</option>
                  <option value="Backend Interview">Backend Interview</option>
                  <option value="Final Round">Final Round</option>
                </select>
              </div>
              <div>
                <label
                  className="text-xs text-muted-foreground"
                  htmlFor="candidateName"
                >
                  Candidate name
                </label>
                <Input
                  id="candidateName"
                  value={form.candidateName}
                  onChange={(event) =>
                    onChange("candidateName", event.target.value)
                  }
                  placeholder="Ada Lovelace"
                  className="mt-1"
                  maxLength={100}
                />
              </div>
              <div>
                <label
                  className="text-xs text-muted-foreground"
                  htmlFor="candidateEmail"
                >
                  Candidate email
                </label>
                <Input
                  id="candidateEmail"
                  type="email"
                  value={form.candidateEmail}
                  onChange={(event) =>
                    onChange("candidateEmail", event.target.value)
                  }
                  placeholder="candidate@company.com"
                  className="mt-1"
                />
              </div>
              <div className="md:col-span-2">
                <label
                  className="text-xs text-muted-foreground"
                  htmlFor="scheduledAt"
                >
                  Date and time
                </label>
                <Input
                  id="scheduledAt"
                  type="datetime-local"
                  value={form.scheduledAt}
                  onChange={(event) =>
                    onChange("scheduledAt", event.target.value)
                  }
                  min={formatDatetimeLocal(new Date())}
                  className="mt-1"
                  required
                />
              </div>
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={busy}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={busy || !form.scheduledAt}>
                <CalendarPlus size={15} />
                {busy ? "Scheduling..." : "Schedule interview"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function RoomList({
  rooms,
  emptyText,
  copiedRoomId,
  onCopyRoomCode,
  onEmailRoomInvite,
  onCancelScheduledRoom,
}) {
  return (
    <ul className="divide-y divide-border">
      {rooms.length === 0 && (
        <li className="rounded-lg border border-dashed border-border bg-background/30 p-6 text-sm text-muted-foreground">
          {emptyText}
        </li>
      )}
      {rooms.map((room) => (
        <li
          key={room.id}
          className="flex flex-wrap items-center justify-between gap-3 py-3.5"
        >
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-secondary text-primary">
              <Video size={16} />
            </span>
            <div className="min-w-0">
              <div className="truncate font-medium">{room.title}</div>
              {(room.candidateName || room.interviewType) && (
                <div className="truncate text-xs text-muted-foreground">
                  {[room.candidateName, room.interviewType]
                    .filter(Boolean)
                    .join(" · ")}
                </div>
              )}
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Calendar size={12} /> {formatRoomDate(room)}
                </span>
                <span className={statusBadgeClass(room.status)}>
                  {room.status || "active"}
                </span>
                {(room.code || room.id) && (
                  <span className="font-mono">{room.code || room.id}</span>
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
            {onEmailRoomInvite && room.candidateEmail && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => onEmailRoomInvite(room)}
              >
                <Mail size={14} />
                Invite
              </Button>
            )}
            {onCancelScheduledRoom && room.status === "waiting" && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => onCancelScheduledRoom(room)}
              >
                Cancel
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
