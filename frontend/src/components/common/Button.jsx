import { forwardRef } from "react";
import { cn } from "@/lib/cn";

const variants = {
  primary: "btn-primary",
  secondary:
    "border border-border bg-secondary text-secondary-foreground hover:bg-secondary/80",
  ghost: "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
  outline:
    "border border-border bg-transparent text-foreground hover:bg-secondary/60",
  danger:
    "border border-destructive/50 bg-destructive text-destructive-foreground hover:bg-destructive/90",
};

const sizes = {
  sm: "h-8 px-3 text-xs rounded-md",
  md: "h-10 px-4 text-sm rounded-lg",
  lg: "h-11 px-5 text-sm rounded-lg",
  icon: "h-10 w-10 rounded-lg",
};

export const Button = forwardRef(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = "Button";
