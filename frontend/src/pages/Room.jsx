import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Video, VideoOff, ScreenShare, MessageSquare, Users, PhoneOff, Wifi } from "lucide-react";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { VideoGrid } from "@/components/video/VideoGrid";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { Button } from "@/components/common/Button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setRoom, setConnection, leaveRoom } from "@/features/room/roomSlice";
import { setChatOpen, setParticipantsOpen } from "@/features/ui/uiSlice";
import { useElapsed } from "@/hooks/useElapsed";
import { cn } from "@/lib/cn";

export default function RoomPage() {
  const { roomId = "" } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const room = useAppSelector(s => s.room);
  const ui = useAppSelector(s => s.ui);
  const elapsed = useElapsed(room.startedAt);

  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(true);
  const [screen, setScreen] = useState(false);

  useEffect(() => {
    dispatch(setRoom({ id: roomId, title: `Interview · ${roomId}` }));
    dispatch(setConnection("connecting"));
    const t = setTimeout(() => dispatch(setConnection("connected")), 700);
    return () => clearTimeout(t);
  }, [roomId, dispatch]);

  function leave() {
    dispatch(leaveRoom());
    navigate("/dashboard");
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <TopBar title={room.title} elapsed={elapsed} status={room.connection} onLeave={leave} />
      <div className="flex min-h-0 flex-1 gap-3 p-3">
        <section className={cn("flex min-w-0 flex-1 flex-col", ui.fullscreenEditor && "w-full")}>
          <CodeEditor roomId={roomId} />
        </section>

        <AnimatePresence initial={false}>
          {!ui.fullscreenEditor && (ui.participantsOpen || ui.chatOpen) && (
            <motion.aside
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              className="hidden w-[340px] flex-col gap-3 lg:flex"
            >
              {ui.participantsOpen && (
                <div className="glass rounded-2xl p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-sm font-semibold">Participants</h3>
                    <span className="text-xs text-muted-foreground">3</span>
                  </div>
                  <VideoGrid />
                </div>
              )}
              {ui.chatOpen && (
                <div className="glass min-h-0 flex-1 overflow-hidden rounded-2xl">
                  <ChatPanel />
                </div>
              )}
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      <BottomBar
        mic={mic} cam={cam} screen={screen}
        onMic={() => setMic(m => !m)} onCam={() => setCam(c => !c)} onScreen={() => setScreen(s => !s)}
        onChat={() => dispatch(setChatOpen(!ui.chatOpen))}
        onPeople={() => dispatch(setParticipantsOpen(!ui.participantsOpen))}
        onLeave={leave}
      />
    </div>
  );
}

function TopBar({ title, elapsed, status, onLeave }) {
  const dot = status === "connected" ? "bg-success" : status === "connecting" ? "bg-warning animate-pulse" : "bg-destructive";
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 px-4 py-3">
      <div className="flex items-center gap-3 min-w-0">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-sm font-bold">P</span>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold">{title}</div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className={cn("h-1.5 w-1.5 rounded-full", dot)}/> {status}
            <span>·</span><Wifi size={12}/> stable
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="rounded-lg bg-secondary px-3 py-1.5 font-mono text-sm tabular-nums">{elapsed}</span>
        <Button variant="danger" size="sm" onClick={onLeave}><PhoneOff size={14}/> Leave</Button>
      </div>
    </header>
  );
}

function BottomBar(props) {
  return (
    <div className="border-t border-border/60 p-3">
      <div className="glass mx-auto flex w-fit items-center gap-2 rounded-2xl p-2">
        <Ctrl on={props.mic} onClick={props.onMic} OnIcon={Mic} OffIcon={MicOff} label="Mic" />
        <Ctrl on={props.cam} onClick={props.onCam} OnIcon={Video} OffIcon={VideoOff} label="Camera" />
        <Ctrl on={props.screen} onClick={props.onScreen} OnIcon={ScreenShare} OffIcon={ScreenShare} label="Share" tone={props.screen ? "primary" : "ghost"}/>
        <span className="mx-1 h-6 w-px bg-border" />
        <button onClick={props.onPeople} className="grid h-11 w-11 place-items-center rounded-xl hover:bg-secondary" aria-label="People"><Users size={18}/></button>
        <button onClick={props.onChat} className="grid h-11 w-11 place-items-center rounded-xl hover:bg-secondary" aria-label="Chat"><MessageSquare size={18}/></button>
        <span className="mx-1 h-6 w-px bg-border" />
        <button onClick={props.onLeave} className="grid h-11 w-11 place-items-center rounded-xl bg-destructive text-destructive-foreground hover:brightness-110" aria-label="Leave">
          <PhoneOff size={18}/>
        </button>
      </div>
    </div>
  );
}

function Ctrl({ on, onClick, OnIcon, OffIcon, label, tone = "default" }) {
  const Icon = on ? OnIcon : OffIcon;
  const cls = !on
    ? "bg-destructive/15 text-destructive"
    : tone === "primary" ? "bg-primary/20 text-primary" : "hover:bg-secondary";
  return (
    <button onClick={onClick} aria-label={label} className={cn("grid h-11 w-11 place-items-center rounded-xl transition", cls)}>
      <Icon size={18}/>
    </button>
  );
}
