/**
 * Central motion tokens.
 * All Framer Motion variants and transitions should reference these to
 * keep animation style consistent across the site.
 */

export const transitions = {
  /** Default smooth transition for most UI elements */
  base: { duration: 0.25, ease: [0.4, 0, 0.2, 1] as const },
  /** Slower, more intentional reveals */
  slow: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const },
  /** Fast micro-interactions */
  fast: { duration: 0.15, ease: [0.4, 0, 0.2, 1] as const },
  /** Spring for scale/bounce effects */
  spring: { type: "spring" as const, stiffness: 300, damping: 30 },
} as const;

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transitions.base },
};

export const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: transitions.base },
};

export const fadeInDown = {
  hidden: { opacity: 0, y: -12 },
  visible: { opacity: 1, y: 0, transition: transitions.base },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: transitions.spring },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

/** Stagger children with fade-up */
export const staggerItem = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: transitions.base },
};
