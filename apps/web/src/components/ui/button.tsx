import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  // Base styles shared across all variants
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "text-sm font-medium",
    "rounded-md",
    "border border-transparent",
    "transition-all duration-150 ease-in-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
    "disabled:pointer-events-none disabled:opacity-40",
    "select-none cursor-pointer",
  ],
  {
    variants: {
      variant: {
        /** Solid foreground – primary action */
        primary: [
          "bg-[var(--color-foreground)] text-[var(--color-background)]",
          "hover:bg-[var(--color-accent)]",
          "active:scale-[0.98]",
        ],
        /** Outlined – secondary action */
        secondary: [
          "border-[var(--color-border)] text-[var(--color-foreground)]",
          "hover:border-[var(--color-muted-2)] hover:bg-[var(--color-surface)]",
        ],
        /** Ghost – low-emphasis action */
        ghost: [
          "text-[var(--color-muted)]",
          "hover:bg-[var(--color-surface)] hover:text-[var(--color-foreground)]",
        ],
        /** Subtle link-style */
        link: [
          "text-[var(--color-foreground)] underline-offset-4 hover:underline",
          "p-0 h-auto",
        ],
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-9 px-4",
        lg: "h-11 px-6 text-base",
        icon: "h-9 w-9 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    /** When true, renders the button as its child (Radix Slot pattern) */
    asChild?: boolean;
  };

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
