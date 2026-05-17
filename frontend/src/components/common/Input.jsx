import { forwardRef } from "react";
import { cn } from "@/lib/cn";

export const Input = forwardRef(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "h-10 w-full rounded-lg border border-border bg-background/60 px-3 text-sm text-foreground placeholder:text-muted-foreground/70",
      "transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-ring",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";
