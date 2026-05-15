import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Code2, Video, MessageSquare, ScreenShare, Users, Zap, Github } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";

const features = [
  { icon: Code2, title: "Live coding", desc: "Monaco-powered editor with syntax highlighting in 40+ languages." },
  { icon: Video, title: "HD video", desc: "Low-latency video tiles with active-speaker detection." },
  { icon: Zap, title: "Realtime sync", desc: "CRDT-style collaborative cursors and instant state sync." },
  { icon: ScreenShare, title: "Screen share", desc: "Share a window or tab without breaking the editor flow." },
  { icon: MessageSquare, title: "Inline chat", desc: "Persistent chat with code snippets and reactions." },
  { icon: Users, title: "Team rooms", desc: "Reusable interview rooms with templates and rubrics." },
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
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-90" style={{ backgroundImage: "var(--gradient-hero)" }} />
      <div className="mx-auto max-w-7xl px-6 pt-24 pb-20 md:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h1 className="mt-6 text-balance text-5xl font-semibold tracking-tight md:text-7xl">
            Interviews that feel <span className="text-gradient">like pair programming</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-base text-muted-foreground md:text-lg">
            Pairloop combines a collaborative editor, HD video, and chat in one calm, focused workspace —
            so you can evaluate signal, not setup.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link to="/register"><Button size="lg" className="group">Start free <ArrowRight size={16} className="transition group-hover:translate-x-0.5" /></Button></Link>
            <a href="#features"><Button variant="outline" size="lg"><Github size={16}/> Read more</Button></a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.2, duration: 0.7 }}
          className="relative mx-auto mt-16 max-w-5xl"
        >
          <DashboardMock />
        </motion.div>
      </div>
    </section>
  );
}

function DashboardMock() {
  return (
    <div className="glass overflow-hidden rounded-3xl ring-glow">
      <div className="flex items-center gap-2 border-b border-border/60 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-warning/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-success/80" />
        <span className="ml-3 text-xs text-muted-foreground">pairloop · Senior Backend · room-9f8a</span>
      </div>
      <div className="grid grid-cols-1 gap-3 p-3 md:grid-cols-[1.5fr_1fr]">
        <div className="rounded-xl bg-background/60 p-4 font-mono text-xs leading-relaxed">
          <pre className="text-muted-foreground"><span className="text-accent">function</span>{" "}<span className="text-primary">twoSum</span>(nums, target) {"{"}
          {"\n"}  <span className="text-accent">const</span> seen = <span className="text-accent">new</span> Map();
          {"\n"}  <span className="text-accent">for</span> (<span className="text-accent">let</span> i = 0; i {"<"} nums.length; i++) {"{"}
          {"\n"}    <span className="text-accent">const</span> need = target - nums[i];
          {"\n"}    <span className="text-accent">if</span> (seen.has(need)) <span className="text-accent">return</span> [seen.get(need), i];
          {"\n"}    seen.set(nums[i], i);
          {"\n"}  {"}"}
          {"\n"}{"}"}
          </pre>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {["Aisha", "You", "Marco", "Lin"].map((n, i) => (
            <div key={n} className="aspect-video rounded-xl bg-gradient-to-br from-secondary to-background ring-1 ring-border flex items-end p-2 text-xs">
              <span className={i === 0 ? "rounded-md bg-success/20 px-1.5 py-0.5 text-success" : "text-muted-foreground"}>{n}</span>
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
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-semibold md:text-4xl">Everything you need, nothing you don't</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">A focused toolkit for technical interviews — designed to disappear so the conversation can lead.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="group h-full transition hover:-translate-y-0.5 hover:ring-glow">
              <div className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary">
                <f.icon size={18} />
              </div>
              <h3 className="text-lg font-semibold">{f.title}</h3>
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
    { n: "01", t: "Create a room", d: "Spin up a fresh interview workspace in one click." },
    { n: "02", t: "Invite candidates", d: "Share a link — no installs, no accounts required." },
    { n: "03", t: "Run the interview", d: "Code, talk, and review side by side, in real time." },
  ];
  return (
    <section id="how" className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-semibold md:text-4xl">How it works</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {steps.map(s => (
          <Card key={s.n} className="relative overflow-hidden">
            <span className="absolute -right-4 -top-6 text-7xl font-bold text-primary/10">{s.n}</span>
            <h3 className="text-lg font-semibold">{s.t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <Card className="ring-glow flex flex-col items-center gap-5 rounded-3xl p-10 text-center">
        <h2 className="text-3xl font-semibold md:text-4xl">Ready to run better interviews?</h2>
        <p className="max-w-lg text-muted-foreground">Free during beta. No credit card. Cancel anytime.</p>
        <Link to="/register"><Button size="lg">Create your first room <ArrowRight size={16} /></Button></Link>
      </Card>
    </section>
  );
}
