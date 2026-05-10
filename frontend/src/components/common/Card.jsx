import { cn } from "@/lib/cn";

export function Card({ className, ...props }) {
  return <div className={cn("glass rounded-2xl p-5", className)} {...props} />;
}
