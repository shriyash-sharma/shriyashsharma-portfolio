import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-1.5 whitespace-nowrap",
    "text-[13px] font-medium tracking-[-0.005em]",
    "rounded-md border border-transparent",
    "transition-[background-color,border-color,color,opacity,box-shadow] duration-[140ms] ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]",
    "disabled:pointer-events-none disabled:opacity-35",
    "select-none cursor-pointer",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-[var(--color-foreground)] !text-[#0a0a0a]",
          "hover:bg-[var(--color-accent)]",
          "active:scale-[0.97] active:opacity-90",
        ],
        secondary: [
          "border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-secondary)]",
          "hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-3)] hover:text-[var(--color-foreground)]",
        ],
        ghost: [
          "text-[var(--color-muted)]",
          "hover:bg-[var(--color-surface-2)] hover:text-[var(--color-secondary)]",
        ],
        link: [
          "text-[var(--color-secondary)] underline-offset-4 hover:underline hover:text-[var(--color-foreground)]",
          "p-0 h-auto rounded-none",
        ],
      },
      size: {
        sm:   "h-7 px-3 text-[12px] rounded",
        md:   "h-9 px-4",
        lg:   "h-11 px-5 text-[14.5px]",
        icon: "h-11 w-11 p-0",
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
