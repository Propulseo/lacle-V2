"use client";

import { useId } from "react";
import { motion } from "framer-motion";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const SMOOTH: [number, number, number, number] = [0.65, 0, 0.35, 1];

interface SplashOrbitalProps {
  phase: number;
  isSplash: boolean;
  skip: boolean;
}

export function SplashOrbital({ phase, isSplash, skip }: SplashOrbitalProps) {
  const uid = useId().replace(/:/g, "");
  const gradId = `og-${uid}`;

  return (
    <motion.div
      // Masqué sous `lg` pendant l'état hero (évite que l'orbital
      // recouvre le titre / CTAs sur mobile-tablet). Visible pendant
      // le splash : centré au-dessus d'un overlay sombre, sans conflit.
      className={`pointer-events-none absolute z-30 ${
        isSplash ? "" : "hidden lg:block"
      }`}
      style={{ top: "50%", translateY: "-50%" }}
      initial={
        skip
          ? { left: "76%", translateX: "-50%", width: 440 }
          : { left: "50%", translateX: "-50%", width: 300 }
      }
      animate={
        isSplash
          ? { left: "50%", translateX: "-50%", width: 300 }
          : { left: "76%", translateX: "-50%", width: 440 }
      }
      transition={{ duration: 1.2, ease: SMOOTH }}
      aria-hidden="true"
    >
      <div className="relative aspect-square w-full">
        <motion.div
          className="pointer-events-none absolute -inset-[25%] rounded-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 1 ? 1 : 0 }}
          transition={{ duration: 0.8 }}
          style={{
            background: "radial-gradient(circle, var(--hero-orbital-glow-inner) 0%, var(--hero-orbital-glow-outer) 40%, transparent 70%)",
          }}
        />

        <svg viewBox="0 0 500 500" fill="none" className="relative h-full w-full">
          {/* Key — phase 0+ */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 0 ? 0.55 : 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <g className="orb-a" style={{ animation: "orbFloat 7s ease-in-out infinite" }}>
              <circle cx="250" cy="200" r="42" stroke={`url(#${gradId})`} strokeWidth="2" fill="none" />
              <circle cx="250" cy="200" r="24" stroke="var(--color-ivoire)" strokeWidth="1.2" fill="none" />
              <circle cx="250" cy="200" r="8" stroke={`url(#${gradId})`} strokeWidth="0.8" fill="none" opacity="0.7" />
              <rect x="248" y="242" width="4" height="90" fill="var(--color-ivoire)" rx="2" />
              <rect x="252" y="296" width="16" height="3" fill="var(--color-ivoire)" rx="1" />
              <rect x="252" y="310" width="11" height="3" fill="var(--color-ivoire)" rx="1" />
              <rect x="252" y="324" width="16" height="3" fill="var(--color-ivoire)" rx="1" />
            </g>
          </motion.g>

          {/* Inner gold ring — phase 1+ */}
          <motion.circle
            cx="250" cy="250" r="120"
            stroke={`url(#${gradId})`} strokeWidth="1.5"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
              opacity: phase >= 1 ? 0.6 : 0,
              scale: phase >= 1 ? 1 : 0.9,
            }}
            transition={{ duration: 0.6, ease: EASE }}
            style={{ transformOrigin: "250px 250px" }}
          />

          {/* Dashed ring — phase 2+ */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 2 ? 1 : 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <g className="orb-a" style={{ transformOrigin: "250px 250px", animation: "orbSpin 110s linear infinite reverse" }}>
              <circle cx="250" cy="250" r="175" stroke="var(--color-ivoire)" strokeWidth="0.7" opacity="0.3" strokeDasharray="6 14" />
            </g>
          </motion.g>

          {/* Outer ring — phase 3+ */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 3 ? 1 : 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <g className="orb-a" style={{ transformOrigin: "250px 250px", animation: "orbSpin 80s linear infinite" }}>
              <circle cx="250" cy="250" r="230" stroke="var(--color-ivoire)" strokeWidth="0.8" opacity="0.35" />
              <path d="M250 20A230 230 0 01 480 250" stroke={`url(#${gradId})`} strokeWidth="1.8" opacity="0.6" />
              <path d="M20 250A230 230 0 01 250 480" stroke="var(--color-ivoire)" strokeWidth="0.8" opacity="0.2" />
            </g>
          </motion.g>

          {/* Cardinal + accent dots — phase 3+ */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 3 ? 1 : 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <circle cx="250" cy="20" r="2.5" fill={`url(#${gradId})`} opacity="0.6" />
            <circle cx="480" cy="250" r="2" fill="var(--color-ivoire)" opacity="0.35" />
            <circle cx="250" cy="480" r="2.5" fill={`url(#${gradId})`} opacity="0.5" />
            <circle cx="20" cy="250" r="2" fill="var(--color-ivoire)" opacity="0.3" />

            <g className="orb-a" style={{ transformOrigin: "250px 250px", animation: "orbSpin 45s linear infinite" }}>
              <circle cx="250" cy="12" r="2" fill={`url(#${gradId})`} opacity="0.7" />
              <circle cx="488" cy="250" r="1.5" fill="var(--color-ivoire)" opacity="0.4" />
            </g>
            <g className="orb-a" style={{ transformOrigin: "250px 250px", animation: "orbSpin 60s linear infinite reverse" }}>
              <circle cx="75" cy="115" r="1.5" fill={`url(#${gradId})`} opacity="0.45" />
              <circle cx="425" cy="385" r="1.5" fill="var(--color-ivoire)" opacity="0.35" />
            </g>
          </motion.g>

          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--color-bronze)" />
              <stop offset="100%" stopColor="var(--color-bronze-clair)" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </motion.div>
  );
}
