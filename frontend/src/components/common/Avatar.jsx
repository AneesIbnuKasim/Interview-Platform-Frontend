import { cn } from "@/lib/cn";

export function Avatar({ name, color, size = 36, className }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((item) => item[0])
    .join("")
    .toUpperCase();

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
      {initials}
    </div>
  );
}
