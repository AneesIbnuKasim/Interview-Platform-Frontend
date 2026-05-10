import { motion } from "framer-motion";
import { Mic, MicOff, Video, VideoOff, Wifi } from "lucide-react";
import type { Participant } from "@/features/participants/participantsSlice";
import { Avatar } from "@/components/common/Avatar";
import { cn } from "@/lib/cn";

export function ParticipantTile({ p }: { p: Participant }) {
  const qualityColor = p.quality === "good" ? "text-success" : p.quality === "ok" ? "text-warning" : "text-destructive";
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "relative aspect-video overflow-hidden rounded-xl border bg-gradient-to-br from-secondary to-background",
        p.speaking ? "border-success/60 ring-2 ring-success/40" : "border-border",
      )}
    >
      {p.cameraOn ? (
        <div className="absolute inset-0 grid place-items-center">
          <Avatar name={p.name} color={p.color} size={56}/>
        </div>
      ) : (
        <div className="absolute inset-0 grid place-items-center bg-background/50 text-muted-foreground">
          <Avatar name={p.name} color={p.color} size={48}/>
        </div>
      )}
      <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1.5 rounded-md bg-background/70 px-1.5 py-0.5 text-[11px] backdrop-blur">
        <span className="truncate max-w-[100px]">{p.name}</span>
        {p.muted ? <MicOff size={11} className="text-destructive"/> : <Mic size={11} className="text-success"/>}
      </div>
      <div className="absolute right-1.5 top-1.5 flex items-center gap-1">
        {!p.cameraOn && <span className="rounded-md bg-background/70 p-1 backdrop-blur"><VideoOff size={11}/></span>}
        <span className={cn("rounded-md bg-background/70 p-1 backdrop-blur", qualityColor)}><Wifi size={11}/></span>
      </div>
    </motion.div>
  );
}
