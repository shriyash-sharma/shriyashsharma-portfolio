/**
 * Central motion token library.
 * Reference these everywhere — never inline ad-hoc animation values.
 *
 * Philosophy: restrained, purposeful, sub-200ms for interactions,
 * slower (300-500ms) only for entrance reveals.
 */

// ─── Transition presets ────────────────────────────────────────────
export const transitions = {
  /** Micro-interactions: hover states, toggles */
  micro: { duration: 0.14, ease: [0.25, 0.1, 0.25, 1] as const },
  /** Standard UI transitions */
  base: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as const },
  /** Entrance reveals — slightly slower for reading comfort */
  reveal: { duration: 0.38, ease: [0, 0, 0.2, 1] as const },
  /** Expressive spring — layout shifts, active indicators */
  spring: { type: "spring" as const, stiffness: 380, damping: 36, mass: 0.8 },
  /** Gentle spring — mobile drawers, panels */
  springGentle: { type: "spring" as const, stiffness: 240, damping: 32, mass: 1 },
} as const;

// ─── Entrance variants ─────────────────────────────────────────────
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transitions.reveal },
};

export const fadeInUp = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.reveal,
  },
};

export const fadeInDown = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: transitions.base },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: [0, 0, 0.2, 1] as const },
  },
};

// ─── Stagger orchestration ─────────────────────────────────────────
export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04,
    },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.reveal,
  },
};

// ─── Navbar mobile drawer ──────────────────────────────────────────
export const drawerVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: transitions.springGentle,
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.18, ease: [0.4, 0, 0.2, 1] as const },
  },
};
