"use client";

import { useId } from "react";

interface HeroOrbitalKeyProps {
  className?: string;
}

export function HeroOrbitalKey({ className }: HeroOrbitalKeyProps) {
  const uid = useId().replace(/:/g, "");
  const grad = `okg-${uid}`;

  return (
    <div className={`relative aspect-square ${className ?? ""}`} aria-hidden="true">
      <style>{`
        @keyframes orbSpin {
          to { transform: rotate(360deg); }
        }
        @keyframes orbFloat {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-10px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .orb-a { animation: none !important; }
        }
      `}</style>

      {/* Soft glow — allowed to bleed outside the box */}
      <div
        className="pointer-events-none absolute -inset-[25%] rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(circle, rgba(176,141,87,0.07) 0%, rgba(26,16,34,0.10) 40%, transparent 70%)",
        }}
      />

      <svg viewBox="0 0 500 500" fill="none" className="relative h-full w-full">
        {/* Outer orbit — slow spin */}
        <g className="orb-a" style={{ transformOrigin: "250px 250px", animation: "orbSpin 80s linear infinite" }}>
          <circle cx="250" cy="250" r="230" stroke="var(--color-ivoire)" strokeWidth="0.5" opacity="0.12" />
          <path d="M250 20A230 230 0 01 480 250" stroke={`url(#${grad})`} strokeWidth="1.2" opacity="0.3" />
          <path d="M20 250A230 230 0 01 250 480" stroke="var(--color-ivoire)" strokeWidth="0.5" opacity="0.08" />
        </g>

        {/* Dashed ring — counter-spin */}
        <g className="orb-a" style={{ transformOrigin: "250px 250px", animation: "orbSpin 110s linear infinite reverse" }}>
          <circle cx="250" cy="250" r="175" stroke="var(--color-ivoire)" strokeWidth="0.4" opacity="0.1" strokeDasharray="6 14" />
        </g>

        {/* Inner gold ring — static */}
        <circle cx="250" cy="250" r="120" stroke={`url(#${grad})`} strokeWidth="0.8" opacity="0.3" />

        {/* Key — floating */}
        <g className="orb-a" style={{ opacity: 0.18, animation: "orbFloat 7s ease-in-out infinite" }}>
          <circle cx="250" cy="200" r="42" stroke={`url(#${grad})`} strokeWidth="1.5" fill="none" />
          <circle cx="250" cy="200" r="24" stroke="var(--color-ivoire)" strokeWidth="0.8" fill="none" />
          <circle cx="250" cy="200" r="8" stroke={`url(#${grad})`} strokeWidth="0.5" fill="none" opacity="0.5" />
          <rect x="248" y="242" width="4" height="90" fill="var(--color-ivoire)" rx="2" />
          <rect x="252" y="296" width="16" height="3" fill="var(--color-ivoire)" rx="1" />
          <rect x="252" y="310" width="11" height="3" fill="var(--color-ivoire)" rx="1" />
          <rect x="252" y="324" width="16" height="3" fill="var(--color-ivoire)" rx="1" />
        </g>

        {/* Cardinal dots */}
        <circle cx="250" cy="20" r="2" fill={`url(#${grad})`} opacity="0.3" />
        <circle cx="480" cy="250" r="1.5" fill="var(--color-ivoire)" opacity="0.12" />
        <circle cx="250" cy="480" r="2" fill={`url(#${grad})`} opacity="0.2" />
        <circle cx="20" cy="250" r="1.5" fill="var(--color-ivoire)" opacity="0.1" />

        {/* Accent dots — fast spin */}
        <g className="orb-a" style={{ transformOrigin: "250px 250px", animation: "orbSpin 45s linear infinite" }}>
          <circle cx="250" cy="12" r="1.5" fill={`url(#${grad})`} opacity="0.4" />
          <circle cx="488" cy="250" r="1" fill="var(--color-ivoire)" opacity="0.18" />
        </g>

        {/* Accent dots — reverse */}
        <g className="orb-a" style={{ transformOrigin: "250px 250px", animation: "orbSpin 60s linear infinite reverse" }}>
          <circle cx="75" cy="115" r="1" fill={`url(#${grad})`} opacity="0.2" />
          <circle cx="425" cy="385" r="1" fill="var(--color-ivoire)" opacity="0.12" />
        </g>

        <defs>
          <linearGradient id={grad} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-bronze)" />
            <stop offset="100%" stopColor="var(--color-bronze-clair)" stopOpacity="0.3" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
