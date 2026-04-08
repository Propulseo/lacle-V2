"use client";

import { motion, MotionConfig } from "framer-motion";
import { useState, useCallback } from "react";
import { useTheme } from "@/lib/theme";

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

interface BlobConfig {
  size: string;
  color: string;
  opacity: [number, number];
  duration: [number, number];
  blur: number;
  startX: number;
  startY: number;
}

const DARK_BLOBS: BlobConfig[] = [
  {
    size: "70vw",
    color: "rgb(80, 60, 30)",
    opacity: [0.08, 0.18],
    duration: [20, 28],
    blur: 100,
    startX: 65,
    startY: 5,
  },
  {
    size: "55vw",
    color: "rgb(70, 50, 25)",
    opacity: [0.06, 0.14],
    duration: [16, 24],
    blur: 90,
    startX: -5,
    startY: 60,
  },
  {
    size: "45vw",
    color: "rgb(90, 65, 35)",
    opacity: [0.05, 0.12],
    duration: [12, 20],
    blur: 80,
    startX: 40,
    startY: 30,
  },
  {
    size: "55vw",
    color: "rgb(50, 35, 20)",
    opacity: [0.04, 0.10],
    duration: [22, 30],
    blur: 100,
    startX: 25,
    startY: 75,
  },
];

const LIGHT_BLOBS: BlobConfig[] = [
  {
    size: "80vw",
    color: "rgb(196, 175, 135)",
    opacity: [0.06, 0.12],
    duration: [24, 34],
    blur: 140,
    startX: 10,
    startY: 10,
  },
  {
    size: "70vw",
    color: "rgb(185, 160, 120)",
    opacity: [0.05, 0.10],
    duration: [20, 30],
    blur: 130,
    startX: 60,
    startY: 55,
  },
  {
    size: "60vw",
    color: "rgb(200, 180, 145)",
    opacity: [0.04, 0.09],
    duration: [18, 26],
    blur: 120,
    startX: 35,
    startY: 80,
  },
  {
    size: "65vw",
    color: "rgb(180, 158, 125)",
    opacity: [0.05, 0.10],
    duration: [26, 36],
    blur: 135,
    startX: 75,
    startY: 15,
  },
];

function AuroraBlob({ config, blendMode }: { config: BlobConfig; blendMode: "screen" | "multiply" }) {
  const newTarget = useCallback(
    () => ({
      x: rand(-20, 80),
      y: rand(-20, 80),
      scale: rand(0.9, 1.1),
      rotate: rand(-8, 8),
      opacity: rand(config.opacity[0], config.opacity[1]),
      dur: rand(config.duration[0], config.duration[1]),
    }),
    [config.opacity, config.duration],
  );

  const [target, setTarget] = useState(newTarget);

  return (
    <motion.div
      initial={{
        left: `${config.startX}%`,
        top: `${config.startY}%`,
        scale: 1,
        rotate: 0,
        opacity: config.opacity[0],
      }}
      animate={{
        left: `${target.x}%`,
        top: `${target.y}%`,
        scale: target.scale,
        rotate: target.rotate,
        opacity: target.opacity,
      }}
      transition={{ duration: target.dur, ease: "easeInOut" }}
      onAnimationComplete={() => setTarget(newTarget())}
      style={{
        position: "absolute",
        width: config.size,
        height: config.size,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${config.color} 0%, transparent 70%)`,
        filter: `blur(${config.blur}px)`,
        mixBlendMode: blendMode,
      }}
    />
  );
}

export function BackgroundAtmosphere() {
  const { theme } = useTheme();
  const blobs = theme === "light" ? LIGHT_BLOBS : DARK_BLOBS;
  const blendMode = theme === "light" ? "multiply" : "screen";

  return (
    <MotionConfig reducedMotion="user">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        {blobs.map((config, i) => (
          <AuroraBlob key={`${theme}-${i}`} config={config} blendMode={blendMode} />
        ))}
      </div>
    </MotionConfig>
  );
}
