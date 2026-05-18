"use client";

import { motion, useReducedMotion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/styles/motion";

type StaggerProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Container that orchestrates staggered fade-up entrances for its children.
 * Respects prefers-reduced-motion — renders immediately without animation.
 */
export function Stagger({ children, className }: StaggerProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Individual staggered child. Must be a direct child of <Stagger>. */
export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div variants={staggerItem} className={className}>
      {children}
    </motion.div>
  );
}
