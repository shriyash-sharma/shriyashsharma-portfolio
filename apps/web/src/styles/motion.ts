/**
 * Central motion token library.
 * Reference these everywhere — never inline ad-hoc animation values.
 *
 * Philosophy: restrained, purposeful, sub-100ms for micro-interactions,
 * sub-200ms for standard UI transitions, 350-500ms only for entrance reveals.
 * Motion should feel fast, precise, and confident — not floaty or dramatic.
 */

// ─── Transition presets ────────────────────────────────────────────
export const transitions = {
  /** Micro-interactions: button press, icon swap — barely perceptible */
  micro:  { duration: 0.08, ease: [0.25, 0.1, 0.25, 1] as const },
  /** Hover states, focus rings, surface color shifts */
  hover:  { duration: 0.12, ease: [0.25, 0.1, 0.25, 1] as const },
  /** Standard UI transitions: drawers, tooltips, tab switches */
  base:   { duration: 0.20, ease: [0.25, 0.1, 0.25, 1] as const },
  /** Entrance reveals — expo-out easing for a confident arrival */
  reveal: { duration: 0.42, ease: [0.16, 1, 0.3, 1] as const },
  /** Expressive spring — active nav pill, layout shifts */
  spring: { type: "spring" as const, stiffness: 400, damping: 38, mass: 0.8 },
  /** Gentle spring — mobile drawers, panels */
  springGentle: { type: "spring" as const, stiffness: 240, damping: 32, mass: 1 },
} as const;

// ─── Entrance variants ─────────────────────────────────────────────
export const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: transitions.reveal },
};

/** Primary section reveal — subtle upward float */
export const fadeInUp = {
  hidden:  { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.reveal,
  },
};

export const fadeInDown = {
  hidden:  { opacity: 0, y: -8 },
  visible: { opacity: 1, y: 0, transition: transitions.base },
};

export const scaleIn = {
  hidden:  { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.32, ease: [0.16, 1, 0.3, 1] as const },
  },
};

/** Panel or right-anchored element — enters from the right */
export const slideInRight = {
  hidden:  { opacity: 0, x: 18 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.50, delay: 0.30, ease: [0.16, 1, 0.3, 1] as const },
  },
};

// ─── Stagger orchestration ─────────────────────────────────────────
export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.055,
      delayChildren:   0.05,
    },
  },
};

export const staggerItem = {
  hidden:  { opacity: 0, y: 8 },
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
    transition: { duration: 0.16, ease: [0.4, 0, 0.2, 1] as const },
  },
};
