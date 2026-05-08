"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { fadeInUp, transitions } from "@/styles/motion";

type FadeInProps = HTMLMotionProps<"div"> & {
  delay?: number;
};

/**
 * Single-element fade + slide-up reveal.
 * Wraps children in a motion.div with the site's standard fade-up variant.
 */
export function FadeIn({ children, delay = 0, ...props }: FadeInProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      transition={{ ...transitions.base, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
