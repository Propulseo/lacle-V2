export const EASE_INSTITUTIONAL = [0.16, 1, 0.3, 1] as const;
export const EASE_SMOOTH = [0.65, 0, 0.35, 1] as const;

export const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE_INSTITUTIONAL },
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: EASE_INSTITUTIONAL },
  },
};

export const stagger = {
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: EASE_INSTITUTIONAL },
  },
};

export const slideInLeft = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: EASE_INSTITUTIONAL },
  },
};
