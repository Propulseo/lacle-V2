"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { FooterMinimal } from "@/components/layout/FooterMinimal";
import { Header } from "@/components/layout/Header";
import { HeroAtmosphere } from "./HeroAtmosphere";
import { SplashOrbital } from "./SplashOrbital";
import { ROUTES, SPLASH_STORAGE_KEY, SITE } from "@/lib/constants";

/* ── Easings ── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const REVEAL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const SMOOTH: [number, number, number, number] = [0.65, 0, 0.35, 1];

const fadeUp = (delay: number) => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE, delay },
  },
});

const PHASE_DELAYS: Record<number, number> = {
  0: 800, 1: 600, 2: 600, 3: 700, 4: 1200, 5: 50,
};

export function HomeContent() {
  const [skip, setSkip] = useState<boolean | null>(null);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (sessionStorage.getItem(SPLASH_STORAGE_KEY)) {
      setSkip(true);
      setPhase(6);
    } else {
      setSkip(false);
    }
  }, []);

  useEffect(() => {
    if (skip !== false || !(phase in PHASE_DELAYS)) return;
    const t = setTimeout(() => {
      const next = phase + 1;
      if (next >= 5) sessionStorage.setItem(SPLASH_STORAGE_KEY, "true");
      setPhase(next);
    }, PHASE_DELAYS[phase]);
    return () => clearTimeout(t);
  }, [phase, skip]);

  if (skip === null) {
    return <div className="min-h-screen" data-theme="dark" style={{ backgroundColor: "#07080E" }} />;
  }

  const isSplash = phase < 5;
  const showHero = phase >= 6;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showHero ? 1 : 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        style={{ pointerEvents: showHero ? "auto" : "none" }}
      >
        {/*
          toggleHint={showHero} — la micro-animation d'entrée du toggle
          thème ne doit se déclencher qu'une fois le hero visible, sinon
          l'anneau bronze se joue derrière l'overlay splash et reste invisible.
        */}
        <Header toggleHint={showHero} />
      </motion.div>

      <section
        id="main-content"
        className="relative min-h-screen overflow-hidden"
        style={{ backgroundColor: "var(--hero-bg)" }}
      >
        {/* Splash dark overlay */}
        <AnimatePresence>
          {isSplash && (
            <motion.div
              className="absolute inset-0 z-20"
              style={{ backgroundColor: "#07080E" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: SMOOTH }}
            />
          )}
        </AnimatePresence>

        {/* Splash baseline text */}
        <AnimatePresence>
          {phase === 4 && (
            <motion.p
              className="absolute left-1/2 z-40 pointer-events-none -translate-x-1/2 whitespace-nowrap"
              style={{
                bottom: "28%",
                fontFamily: "var(--font-cormorant-garamond), Georgia, serif",
                fontSize: "clamp(1.125rem, 2vw, 1.25rem)",
                letterSpacing: "0.15em",
                color: "var(--color-cendre)",
              }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              {SITE.baseline}
            </motion.p>
          )}
        </AnimatePresence>

        <HeroAtmosphere />

        {/* Content */}
        <div
          className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center px-6 lg:px-12"
          style={{ zoom: 1.12 }}
        >
          {/* Left: hero content */}
          <motion.div
            className="relative z-10 max-w-xl py-20"
            initial="hidden"
            animate={showHero ? "visible" : "hidden"}
          >
            <motion.p
              className="mb-6"
              style={{
                fontFamily: "var(--font-libre-franklin), system-ui, sans-serif",
                fontSize: 11, fontWeight: 600,
                letterSpacing: "0.5em", textTransform: "uppercase",
                color: "var(--hero-surtitre)",
              }}
              variants={fadeUp(0)}
            >
              Institut
            </motion.p>

            <motion.h1
              className="mb-8 text-7xl sm:text-8xl lg:text-[9rem] xl:text-[11rem]"
              style={{
                fontFamily: "var(--font-cormorant-garamond), Georgia, serif",
                fontWeight: 600, lineHeight: 0.85,
                letterSpacing: "-0.02em", color: "var(--hero-title)",
              }}
              variants={{
                hidden: { clipPath: "inset(100% 0 0 0)" },
                visible: {
                  clipPath: "inset(0 0 0 0)",
                  transition: { duration: 1, ease: REVEAL_EASE, delay: 0.2 },
                },
              }}
            >
              La Clé
            </motion.h1>

            <motion.div
              className="mb-8 origin-left"
              style={{
                width: 100, height: 1,
                background: "linear-gradient(to right, var(--hero-line-start), var(--hero-line-mid), transparent)",
              }}
              variants={{
                hidden: { scaleX: 0 },
                visible: {
                  scaleX: 1,
                  transition: { duration: 0.8, ease: EASE, delay: 0.6 },
                },
              }}
            />

            <motion.p
              className="mb-12 max-w-md text-lg lg:text-[1.15rem]"
              style={{
                fontFamily: "var(--font-libre-franklin), system-ui, sans-serif",
                fontWeight: 400, lineHeight: 1.625,
                color: "var(--hero-subtitle)",
              }}
              variants={fadeUp(0.8)}
            >
              {"Centre de formation dédié au développement humain et à l\u2019accompagnement professionnel"}
            </motion.p>

            <motion.div
              className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6"
              variants={fadeUp(1.0)}
            >
              <Link
                href={ROUTES.discover}
                className="hero-cta-primary group relative inline-flex items-center justify-center overflow-hidden px-8 py-4"
                style={{ fontFamily: "var(--font-libre-franklin), system-ui, sans-serif" }}
              >
                <span className="relative z-10">Nous découvrir</span>
                <span className="hero-cta-sweep" />
              </Link>
              <Link
                href={ROUTES.formations}
                className="hero-cta-secondary group inline-flex items-center gap-2"
                style={{ fontFamily: "var(--font-libre-franklin), system-ui, sans-serif" }}
              >
                Formations
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="hero-arrow"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
              </Link>
              <Link
                href={ROUTES.accessSpace}
                className="hero-cta-secondary group inline-flex items-center gap-2"
                style={{ fontFamily: "var(--font-libre-franklin), system-ui, sans-serif" }}
              >
                Espace apprenant
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="hero-arrow"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
              </Link>
            </motion.div>
          </motion.div>

          <SplashOrbital phase={phase} isSplash={isSplash} skip={!!skip} />
        </div>
      </section>

      <FooterMinimal />
    </>
  );
}
