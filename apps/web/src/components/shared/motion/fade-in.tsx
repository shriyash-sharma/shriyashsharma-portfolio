"use client";

import { motion, useReducedMotion } from "framer-motion";
import { fadeInUp, transitions } from "@/styles/motion";

type FadeInProps = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
};

/**
 * Single-element fade + slide-up reveal, viewport-triggered.
 * Respects prefers-reduced-motion — renders immediately without animation.
 */
export function FadeIn({ children, delay = 0, className }: FadeInProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ ...transitions.reveal, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
