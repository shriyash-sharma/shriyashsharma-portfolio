"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/styles/motion";

type StaggerProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Container that staggers its children with fade-up animation.
 * Wrap a list of items in <Stagger> and each direct child gets staggered.
 */
export function Stagger({ children, className }: StaggerProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
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
  return (
    <motion.div variants={staggerItem} className={className}>
      {children}
    </motion.div>
  );
}
