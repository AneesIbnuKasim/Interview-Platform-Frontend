import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Calendar, Clock, Users, ArrowRight, Video } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Avatar } from "@/components/common/Avatar";

const recentRooms = [
  { id: "9f8a", title: "Senior Backend — Aisha P.", date: "Today, 2:00 PM", participants: ["Aisha", "You", "Marco"] },
  { id: "4c1b", title: "Frontend Screen — Lin Q.", date: "Yesterday", participants: ["Lin", "You"] },
  { id: "7d22", title: "Systems Design — Marco D.", date: "Mon, 10:00 AM", participants: ["Marco", "You", "Aisha"] },
];

const upcoming = [
  { title: "Final round — Jordan K.", at: "Tomorrow · 11:00 AM" },
  { title: "Coding screen — Priya S.", at: "Fri · 3:30 PM" },
];

const stats = [
  { label: "Rooms this week", value: "12", delta: "+3" },
  { label: "Avg. duration", value: "47m", delta: "-4m" },
  { label: "Candidates", value: "28", delta: "+8" },
  { label: "Pass rate", value: "62%", delta: "+5%" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [join, setJoin] = useState("");
  const newId = () => Math.random().toString(36).slice(2, 8);

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold md:text-3xl">Good to see you 👋</h1>
            <p className="text-sm text-muted-foreground">Pick up where you left off, or start a new interview.</p>
          </div>
          <Button onClick={() => navigate(`/room/${newId()}`)}>
            <Plus size={16}/> New room
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">{s.label}</div>
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
              <Link to="/dashboard" className="text-xs text-muted-foreground hover:text-foreground">See all</Link>
            </div>
            <ul className="divide-y divide-border">
              {recentRooms.map(r => (
                <li key={r.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-primary"><Video size={16}/></span>
                    <div className="min-w-0">
                      <div className="truncate font-medium">{r.title}</div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar size={12}/> {r.date}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {r.participants.map(p => <Avatar key={p} name={p} size={26} className="ring-2 ring-background"/>)}
                    </div>
                    <Link to={`/room/${r.id}`}>
                      <Button size="sm" variant="outline">Open <ArrowRight size={14}/></Button>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          <div className="flex flex-col gap-4">
            <Card>
              <h2 className="text-lg font-semibold">Join a room</h2>
              <p className="mt-1 text-xs text-muted-foreground">Paste a room code to jump in instantly.</p>
              <div className="mt-3 flex gap-2">
                <Input placeholder="e.g. 9f8a" value={join} onChange={e => setJoin(e.target.value)} />
                <Button disabled={!join} onClick={() => navigate(`/room/${join}`)}>Join</Button>
              </div>
            </Card>
            <Card>
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Upcoming</h2>
                <Clock size={14} className="text-muted-foreground"/>
              </div>
              <ul className="space-y-3">
                {upcoming.map(u => (
                  <li key={u.title} className="rounded-xl bg-background/50 p-3">
                    <div className="text-sm font-medium">{u.title}</div>
                    <div className="text-xs text-muted-foreground">{u.at}</div>
                  </li>
                ))}
              </ul>
              <Button variant="outline" size="sm" className="mt-3 w-full"><Users size={14}/> Invite teammates</Button>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
