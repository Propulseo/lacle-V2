"use client";

import { motion } from "framer-motion";
import { EASE_SMOOTH } from "@/lib/animations";

interface KeySymbolProps {
  className?: string;
  animate?: boolean;
}

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (delay: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { delay, duration: 0.8, ease: EASE_SMOOTH },
      opacity: { delay, duration: 0.2 },
    },
  }),
};

export function KeySymbol({ className = "", animate = true }: KeySymbolProps) {
  const shared = {
    viewBox: "0 0 48 120",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (!animate) {
    return (
      <svg {...shared} className={className}>
        <circle cx="24" cy="18" r="14" />
        <line x1="24" y1="32" x2="24" y2="100" />
        <line x1="24" y1="78" x2="36" y2="78" />
        <line x1="24" y1="92" x2="32" y2="92" />
      </svg>
    );
  }

  return (
    <motion.svg {...shared} className={className} initial="hidden" animate="visible">
      <motion.circle cx="24" cy="18" r="14" variants={draw} custom={0} />
      <motion.line x1="24" y1="32" x2="24" y2="100" variants={draw} custom={0.3} />
      <motion.line x1="24" y1="78" x2="36" y2="78" variants={draw} custom={0.7} />
      <motion.line x1="24" y1="92" x2="32" y2="92" variants={draw} custom={0.9} />
    </motion.svg>
  );
}
