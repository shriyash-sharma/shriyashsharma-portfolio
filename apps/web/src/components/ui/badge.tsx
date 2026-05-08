import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const badgeVariants = cva(
  [
    "inline-flex items-center gap-1",
    "text-xs font-medium tracking-wide",
    "rounded-full px-2.5 py-0.5",
    "border",
    "transition-colors duration-150",
  ],
  {
    variants: {
      variant: {
        default: [
          "border-[var(--color-border)]",
          "bg-[var(--color-surface-2)]",
          "text-[var(--color-muted)]",
        ],
        accent: [
          "border-[var(--color-foreground)]/20",
          "bg-[var(--color-foreground)]/5",
          "text-[var(--color-foreground)]",
        ],
        outline: [
          "border-[var(--color-border)]",
          "bg-transparent",
          "text-[var(--color-muted)]",
        ],
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
