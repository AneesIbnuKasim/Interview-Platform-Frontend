import { cn } from "@/lib/cn";

export function Avatar({ name, color, size = 36, className }) {
  const initials = name.split(" ").slice(0, 2).map(s => s[0]).join("").toUpperCase();
  return (
    <div
      className={cn("inline-flex items-center justify-center rounded-full font-semibold text-white", className)}
      style={{ width: size, height: size, fontSize: size * 0.4, background: color ?? "linear-gradient(135deg,#7c3aed,#06b6d4)" }}
    >
      {initials}
    </div>
  );
}
