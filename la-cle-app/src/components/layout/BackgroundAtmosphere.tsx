"use client";

import { motion, MotionConfig } from "framer-motion";
import { useState, useCallback } from "react";

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

const BLOBS: BlobConfig[] = [
  {
    size: "70vw",
    color: "rgb(12, 30, 80)",
    opacity: [0.2, 0.4],
    duration: [20, 28],
    blur: 100,
    startX: 65,
    startY: 5,
  },
  {
    size: "55vw",
    color: "rgb(10, 25, 70)",
    opacity: [0.15, 0.35],
    duration: [16, 24],
    blur: 90,
    startX: -5,
    startY: 60,
  },
  {
    size: "45vw",
    color: "rgb(15, 35, 80)",
    opacity: [0.12, 0.28],
    duration: [12, 20],
    blur: 80,
    startX: 40,
    startY: 30,
  },
];

function AuroraBlob({ config }: { config: BlobConfig }) {
  const newTarget = useCallback(
    () => ({
      x: rand(-20, 80),
      y: rand(-20, 80),
      scale: rand(0.9, 1.1),
      rotate: rand(-8, 8),
      opacity: rand(config.opacity[0], config.opacity[1]),
      dur: rand(config.duration[0], config.duration[1]),
    }),
    [config.opacity, config.duration]
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
        mixBlendMode: "screen",
      }}
    />
  );
}

export function BackgroundAtmosphere() {
  return (
    <MotionConfig reducedMotion="never">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        {BLOBS.map((config, i) => (
          <AuroraBlob key={i} config={config} />
        ))}
      </div>
    </MotionConfig>
  );
}
