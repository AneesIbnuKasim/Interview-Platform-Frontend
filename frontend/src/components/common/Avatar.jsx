import { cn } from "@/lib/cn";

function resolveMediaUrl(src) {
  if (!src || src.startsWith("http") || src.startsWith("data:")) return src;

  const origin =
    import.meta.env.VITE_SOCKET_URL ||
    import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, "");

  return origin ? `${origin.replace(/\/$/, "")}${src}` : src;
}

export function Avatar({ name, color, size = 36, src, className }) {
  const initials = (name || "User")
    .split(" ")
    .slice(0, 2)
    .map((item) => item[0])
    .join("")
    .toUpperCase();
  const imageUrl = resolveMediaUrl(src);

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full border border-white/10 bg-secondary font-medium text-foreground",
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
          className="h-full w-full rounded-full object-cover"
        />
      ) : (
        initials
      )}
    </div>
  );
}
