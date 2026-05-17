import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Code2,
  MessageSquare,
  ScreenShare,
  Users,
  Video,
  Zap,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";

const features = [
  {
    icon: Code2,
    title: "Live coding",
    desc: "Monaco editor with collaborative syncing and code execution.",
  },
  {
    icon: Video,
    title: "Video rooms",
    desc: "Peer-to-peer camera, microphone, and participant controls.",
  },
  {
    icon: Zap,
    title: "Realtime sync",
    desc: "Room-based editor, chat, media, and presence updates.",
  },
  {
    icon: ScreenShare,
    title: "Screen share",
    desc: "Share a window or tab without breaking the editor flow.",
  },
  {
    icon: MessageSquare,
    title: "Inline chat",
    desc: "Persistent room chat with timestamps and typing state.",
  },
  {
    icon: Users,
    title: "Team dashboard",
    desc: "Track rooms, recent participants, and quick invites.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-6xl">
            Technical interviews that feel like pair programming
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-7 text-muted-foreground md:text-lg">
            Pairloop combines a collaborative editor, video, and chat in one
            calm, focused workspace — so you can evaluate signal, not setup.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link to="/register">
              <Button size="lg" className="group">
                Start free{" "}
                <ArrowRight
                  size={16}
                  className="transition group-hover:translate-x-0.5"
                />
              </Button>
            </Link>
            <a href="#features">
              <Button variant="outline" size="lg">
                Read more
              </Button>
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="relative mx-auto mt-14 max-w-5xl"
        >
          <DashboardMock />
        </motion.div>
      </div>
    </section>
  );
}

function DashboardMock() {
  return (
    <div className="glass overflow-hidden rounded-xl">
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
        <span className="text-xs font-medium text-muted-foreground">
          Senior Backend Interview
        </span>
        <span className="rounded-md border border-border px-2 py-1 font-mono text-[11px] text-muted-foreground">
          9F8A
        </span>
      </div>
      <div className="grid grid-cols-1 gap-3 p-3 md:grid-cols-[1.5fr_1fr]">
        <div className="rounded-lg border border-border bg-background/65 p-4 font-mono text-xs leading-relaxed">
          <pre className="text-muted-foreground">
            <span className="text-accent">function</span>{" "}
            <span className="text-primary">twoSum</span>(nums, target) {"{"}
            {"\n"} <span className="text-accent">const</span> seen ={" "}
            <span className="text-accent">new</span> Map();
            {"\n"} <span className="text-accent">for</span> (
            <span className="text-accent">let</span> i = 0; i {"<"} nums.length;
            i++) {"{"}
            {"\n"} <span className="text-accent">const</span> need = target -
            nums[i];
            {"\n"} <span className="text-accent">if</span> (seen.has(need)){" "}
            <span className="text-accent">return</span> [seen.get(need), i];
            {"\n"} seen.set(nums[i], i);
            {"\n"} {"}"}
            {"\n"}
            {"}"}
          </pre>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {["Aisha", "You", "Marco", "Lin"].map((n, i) => (
            <div
              key={n}
              className="flex aspect-video items-end rounded-lg border border-border bg-secondary/45 p-2 text-xs"
            >
              <span
                className={
                  i === 0
                    ? "rounded-md bg-success/20 px-1.5 py-0.5 text-success"
                    : "text-muted-foreground"
                }
              >
                {n}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-10 max-w-2xl">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Everything you need, nothing you don't
        </h2>
        <p className="mt-3 text-muted-foreground">
          A focused toolkit for technical interviews — designed to disappear so
          the conversation can lead.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="group h-full transition-colors hover:border-primary/45">
              <div className="mb-4 grid h-9 w-9 place-items-center rounded-md border border-border bg-secondary text-primary">
                <f.icon size={18} />
              </div>
              <h3 className="text-base font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "01",
      t: "Create a room",
      d: "Spin up a fresh interview workspace in one click.",
    },
    {
      n: "02",
      t: "Invite candidates",
      d: "Share a room code and bring candidates into the workspace.",
    },
    {
      n: "03",
      t: "Run the interview",
      d: "Code, talk, and review side by side, in real time.",
    },
  ];
  return (
    <section id="how" className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-10 max-w-2xl">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          How it works
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {steps.map((s) => (
          <Card key={s.n} className="relative overflow-hidden">
            <span className="mb-5 inline-flex h-7 w-7 items-center justify-center rounded-md border border-border text-xs text-muted-foreground">
              {s.n}
            </span>
            <h3 className="text-base font-semibold">{s.t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  const user = JSON.parse(localStorage.getItem("pairloop.user"))?.id;

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <Card className="flex flex-col items-center gap-4 rounded-xl p-8 text-center md:p-10">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Ready to run better interviews?
        </h2>
        <p className="max-w-lg text-muted-foreground">
          Free during beta. No credit card. Cancel anytime.
        </p>
        <Link to={user ? "/dashboard" : "/register"}>
          <Button size="lg">
            Create your first room <ArrowRight size={16} />
          </Button>
        </Link>
      </Card>
    </section>
  );
}
