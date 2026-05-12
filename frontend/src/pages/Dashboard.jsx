import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Calendar, Clock, Users, ArrowRight, Video } from "lucide-react";
import { useEffect, useState } from "react";
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

const upcoming = [
  { title: "Final round — Jordan K.", at: "Tomorrow · 11:00 AM" },
  { title: "Coding screen — Priya S.", at: "Fri · 3:30 PM" },
];

function formatRoomDate(room) {
  const value = room.updatedAt || room.startedAt || room.createdAt;
  if (!value) return "Recently";

  return new Date(value).toLocaleDateString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function activeParticipantNames(room) {
  const names = (room.participants || [])
    .filter((participant) => participant.status !== "left")
    .map((participant) => participant.name);

  return names.length ? names : ["You"];
}

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { error, rooms, status } = useAppSelector((state) => state.room);
  const [join, setJoin] = useState("");
  const busy = status === "loading";

  useEffect(() => {
    dispatch(fetchRooms());
  }, [dispatch]);

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
              Good to see you 👋
            </h1>
            <p className="text-sm text-muted-foreground">
              Pick up where you left off, or start a new interview.
            </p>
          </div>
          <Button onClick={startRoom} disabled={busy}>
            <Plus size={16} /> {busy ? "Creating..." : "New room"}
          </Button>
        </div>
        {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

        <div className="grid gap-4 md:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                  {s.label}
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-semibold">{s.value}</span>
                  <span className="text-xs text-success">{s.delta}</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Recent rooms</h2>
              <Link
                to="/dashboard"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                See all
              </Link>
            </div>
            <ul className="divide-y divide-border">
              {rooms.length === 0 && (
                <li className="py-6 text-sm text-muted-foreground">
                  No rooms yet. Start a new interview when you are ready.
                </li>
              )}
              {rooms.map((r) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-primary">
                      <Video size={16} />
                    </span>
                    <div className="min-w-0">
                      <div className="truncate font-medium">{r.title}</div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar size={12} /> {formatRoomDate(r)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {activeParticipantNames(r).map((p) => (
                        <Avatar
                          key={p}
                          name={p}
                          size={26}
                          className="ring-2 ring-background"
                        />
                      ))}
                    </div>
                    <Link to={`/room/${r.id}`}>
                      <Button size="sm" variant="outline">
                        Open <ArrowRight size={14} />
                      </Button>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          <div className="flex flex-col gap-4">
            <Card>
              <h2 className="text-lg font-semibold">Join a room</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Paste a room code to jump in instantly.
              </p>
              <div className="mt-3 flex gap-2">
                <Input
                  placeholder="e.g. 9f8a"
                  value={join}
                  onChange={(e) => setJoin(e.target.value)}
                />
                <Button disabled={!join || busy} onClick={joinRoom}>
                  Join
                </Button>
              </div>
            </Card>
            <Card>
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Upcoming</h2>
                <Clock size={14} className="text-muted-foreground" />
              </div>
              <ul className="space-y-3">
                {upcoming.map((u) => (
                  <li key={u.title} className="rounded-xl bg-background/50 p-3">
                    <div className="text-sm font-medium">{u.title}</div>
                    <div className="text-xs text-muted-foreground">{u.at}</div>
                  </li>
                ))}
              </ul>
              <Button variant="outline" size="sm" className="mt-3 w-full">
                <Users size={14} /> Invite teammates
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
