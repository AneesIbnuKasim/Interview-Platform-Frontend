import { forwardRef } from "react";
import { cn } from "@/lib/cn";

export const Input = forwardRef(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "h-11 w-full rounded-xl border border-border bg-background/40 px-4 text-sm text-foreground placeholder:text-muted-foreground/70",
      "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";
