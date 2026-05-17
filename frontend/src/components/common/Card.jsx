import { cn } from "@/lib/cn";

export function Card({ className, ...props }) {
  return (
    <div className={cn("glass rounded-lg p-4 md:p-5", className)} {...props} />
  );
}
