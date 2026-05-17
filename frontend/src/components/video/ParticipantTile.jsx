import { motion } from "framer-motion";
import { MonitorUp, Mic, MicOff, VideoOff, Wifi } from "lucide-react";
import { useEffect, useRef } from "react";
import { Avatar } from "@/components/common/Avatar";
import { cn } from "@/lib/cn";

export function ParticipantTile({
  p,
  stream = null,
  screenStream = null,
  isLocal = false,
}) {
  const videoRef = useRef(null);
  const activeStream = p.screenSharing && screenStream ? screenStream : stream;
  const showVideo = Boolean(activeStream && (p.cameraOn || p.screenSharing));
  const isScreenPreview = Boolean(p.screenSharing && screenStream);
  const qualityColor =
    p.quality === "good"
      ? "text-success"
      : p.quality === "ok"
        ? "text-warning"
        : "text-destructive";

  useEffect(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    if (showVideo) {
      video.srcObject = activeStream;
    } else {
      video.srcObject = null;
    }

    return () => {
      video.srcObject = null;
    };
  }, [activeStream, showVideo]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "relative aspect-video overflow-hidden rounded-lg border bg-secondary/55",
        p.speaking
          ? "border-success/60 ring-2 ring-success/40"
          : "border-border",
      )}
    >
      {showVideo ? (
        <video
          ref={videoRef}
          autoPlay
          muted={isLocal}
          playsInline
          className={cn(
            "absolute inset-0 h-full w-full bg-black",
            isScreenPreview ? "object-contain" : "object-cover",
          )}
        />
      ) : p.screenSharing ? (
        <div className="absolute inset-0 grid place-items-center bg-background/70 text-muted-foreground">
          <div className="flex flex-col items-center gap-2 text-xs">
            <MonitorUp size={26} className="text-primary" />
            <span>{p.name} is sharing</span>
          </div>
        </div>
      ) : p.cameraOn ? (
        <div className="absolute inset-0 grid place-items-center">
          <Avatar name={p.name} color={p.color} size={56} />
        </div>
      ) : (
        <div className="absolute inset-0 grid place-items-center bg-background/50 text-muted-foreground">
          <Avatar name={p.name} color={p.color} size={48} />
        </div>
      )}
      <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1.5 rounded-md bg-background/85 px-1.5 py-0.5 text-[11px]">
        <span className="truncate max-w-[100px]">{p.name}</span>
        {isLocal && <span className="text-muted-foreground">you</span>}
        {p.muted ? (
          <MicOff size={11} className="text-destructive" />
        ) : (
          <Mic size={11} className="text-success" />
        )}
      </div>
      <div className="absolute right-1.5 top-1.5 flex items-center gap-1">
        {p.screenSharing && (
          <span className="rounded-md bg-primary/20 p-1 text-primary">
            <MonitorUp size={11} />
          </span>
        )}
        {!p.cameraOn && (
          <span className="rounded-md bg-background/85 p-1">
            <VideoOff size={11} />
          </span>
        )}
        <span className={cn("rounded-md bg-background/85 p-1", qualityColor)}>
          <Wifi size={11} />
        </span>
      </div>
    </motion.div>
  );
}
