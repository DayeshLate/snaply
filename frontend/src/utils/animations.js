export const easeTransitions = {
  smooth: [0.16, 1, 0.3, 1],
  gentle: [0.25, 0.1, 0.25, 1],
  springy: { type: 'spring', stiffness: 380, damping: 28 },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: easeTransitions.smooth },
  },
};

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: custom * 0.1,
      ease: easeTransitions.smooth,
    },
  }),
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (custom = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      delay: custom * 0.08,
      ease: easeTransitions.smooth,
    },
  }),
};

export const staggerContainer = (staggerChildren = 0.1, delayChildren = 0) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

export const hoverLift = {
  rest: { y: 0, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' },
  hover: {
    y: -4,
    boxShadow: '0 12px 24px -4px rgba(33, 150, 243, 0.12)',
    transition: { duration: 0.2, ease: 'easeOut' },
  },
};
