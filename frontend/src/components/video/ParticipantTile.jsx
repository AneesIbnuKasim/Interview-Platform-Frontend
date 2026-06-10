import { Mic, MicOff, VideoOff, Wifi } from "lucide-react";
import { useEffect, useRef } from "react";
import { Avatar } from "@/components/common/Avatar";
import { cn } from "@/lib/cn";

export function ParticipantTile({ p, isLocal = false, stream = null }) {
  const videoRef = useRef(null);
  const qualityColor =
    p.quality === "good"
      ? "text-success"
      : p.quality === "ok"
        ? "text-warning"
        : "text-danger";
  const hasVideo =
    p.cameraOn &&
    stream?.getVideoTracks().some((track) => track.readyState === "live");

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    video.srcObject = stream || null;

    if (stream) {
      video.play().catch(() => {});
    }

    return () => {
      video.srcObject = null;
    };
  }, [stream]);

  function onMove(e) {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty(
      "--mx",
      ((e.clientX - r.left) / r.width).toFixed(3),
    );
    e.currentTarget.style.setProperty(
      "--my",
      ((e.clientY - r.top) / r.height).toFixed(3),
    );
  }
  function onLeave(e) {
    e.currentTarget.style.setProperty("--mx", "0.5");
    e.currentTarget.style.setProperty("--my", "0.5");
  }

  return (
    <div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn(
        "tile-3d relative aspect-video overflow-hidden rounded-[6px] border bg-muted",
        p.speaking ? "border-accent" : "border-border",
      )}
    >
      {stream && (
        <video
          ref={videoRef}
          autoPlay
          muted={isLocal}
          playsInline
          className={cn(
            "absolute inset-0 h-full w-full object-cover",
            !hasVideo && "pointer-events-none opacity-0",
          )}
        />
      )}
      {!hasVideo && (
        <div className="absolute inset-0 grid place-items-center">
          <div className="tile-lift">
            <Avatar name={p.name} size={48} />
          </div>
        </div>
      )}
      <div className="tile-lift absolute bottom-1.5 left-1.5 flex items-center gap-1.5 rounded-[3px] bg-paper/85 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-ink backdrop-blur">
        <span className="truncate max-w-[100px]">{p.name}</span>
        {p.muted ? (
          <MicOff size={10} className="text-danger" />
        ) : (
          <Mic size={10} className="text-success" />
        )}
      </div>
      <div className="tile-lift absolute right-1.5 top-1.5 flex items-center gap-1">
        {!p.cameraOn && (
          <span className="rounded-[3px] bg-paper/85 p-1 backdrop-blur">
            <VideoOff size={10} />
          </span>
        )}
        <span
          className={cn(
            "rounded-[3px] bg-paper/85 p-1 backdrop-blur",
            qualityColor,
          )}
        >
          <Wifi size={10} />
        </span>
      </div>
    </div>
  );
}
