"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface HubCardProps {
  title: string;
  description: string;
  href: string;
  /**
   * Active la micro-animation d'entrée (même famille que le toggle thème :
   * anneau bronze + léger lift). Destinée au premier item d'un hub pour
   * guider l'utilisateur vers un ordre de lecture naturel.
   */
  hintFirstVisit?: boolean;
  /**
   * Clé de session pour garantir une seule diffusion par visite.
   * À différencier par hub afin que plusieurs sections puissent coexister.
   */
  hintStorageKey?: string;
}

export function HubCard({
  title,
  description,
  href,
  hintFirstVisit = false,
  hintStorageKey = "la-cle-hub-hint-seen",
}: HubCardProps) {
  const anchorRef = useRef<HTMLAnchorElement>(null);
  const inView = useInView(anchorRef, { once: true, amount: 0.5 });
  const [playHint, setPlayHint] = useState(false);

  useEffect(() => {
    if (!hintFirstVisit || !inView || playHint) return;
    if (typeof window === "undefined") return;
    setPlayHint(true);
  }, [hintFirstVisit, inView, playHint, hintStorageKey]);

  return (
    <Link
      ref={anchorRef}
      href={href}
      className={`card-elevated group block border border-filet bg-ardoise/40 p-8 transition-all duration-500 ease-[var(--ease-institutional)] hover:-translate-y-1 hover:border-filet-accent md:p-10 ${
        playHint ? "entrance-hint-hub" : ""
      }`}
    >
      <h3 className="mb-4 font-display text-2xl text-ivoire transition-colors duration-500 group-hover:text-bronze-clair md:text-3xl">
        {title}
      </h3>
      <p className="mb-6 text-sm leading-relaxed text-cendre">
        {description}
      </p>
      <span className="inline-block text-xs uppercase tracking-[0.15em] text-pierre transition-all duration-500 group-hover:translate-x-2 group-hover:text-bronze">
        Découvrir &rarr;
      </span>
    </Link>
  );
}
