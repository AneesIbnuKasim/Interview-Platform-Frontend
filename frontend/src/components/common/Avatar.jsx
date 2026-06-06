import { cn } from "@/lib/cn";
import { useEffect, useState } from "react";

function resolveMediaUrl(src) {
  if (!src || src.startsWith("http") || src.startsWith("data:")) return src;

  const origin =
    import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, "") ||
    import.meta.env.VITE_SOCKET_URL;

  return origin ? `${origin.replace(/\/$/, "")}${src}` : src;
}

export function Avatar({ name, color, size = 36, src, className }) {
  const [failed, setFailed] = useState(false);
  const initials = (name || "User")
    .split(" ")
    .slice(0, 2)
    .map((item) => item[0])
    .join("")
    .toUpperCase();
  const imageUrl = failed ? "" : resolveMediaUrl(src);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  return (
    <div
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-secondary font-medium text-foreground",
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        background: color ?? undefined,
      }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name ? `${name} profile` : "Profile"}
          className="block h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        initials
      )}
    </div>
  );
}
