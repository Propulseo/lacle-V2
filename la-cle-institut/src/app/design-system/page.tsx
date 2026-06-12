"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { FooterMinimal } from "@/components/layout/FooterMinimal";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { HeroSection } from "@/components/ui/HeroSection";
import { SplashScreen } from "@/components/splash/SplashScreen";
import { DSPalette } from "@/components/design-system/DSPalette";
import { DSTypography } from "@/components/design-system/DSTypography";
import { DSButtons } from "@/components/design-system/DSButtons";
import { DSSymbol } from "@/components/design-system/DSSymbol";
import { DSCards } from "@/components/design-system/DSCards";
import { DSMotion } from "@/components/design-system/DSMotion";

export default function DesignSystemPage() {
  const [showSplash, setShowSplash] = useState(false);

  return (
    <>
      {/* Page de démo interne : hors index moteurs. Rendu en <meta> hoisté
          par Next (export `metadata` impossible dans un composant client). */}
      <meta name="robots" content="noindex, nofollow" />
      <SplashScreen isVisible={showSplash} onComplete={() => setShowSplash(false)} />
      <Header showBack backHref="/" backLabel="Accueil" />
      <PageWrapper>
        {/* ---- HERO ---- */}
        <HeroSection
          title="Design System"
          subtitle="Institut La Clé : tokens, composants et patterns du système de design institutionnel."
        />

        {/* ---- PALETTE ---- */}
        <DSPalette />

        {/* ---- TYPOGRAPHIE ---- */}
        <DSTypography />

        {/* ---- BOUTONS ---- */}
        <DSButtons />

        {/* ---- SYMBOLE CLÉ ---- */}
        <DSSymbol onPlaySplash={() => setShowSplash(true)} />

        {/* ---- CARTES (hub, formation, modules) ---- */}
        <DSCards />

        {/* ---- SCROLL REVEAL, EXPANDABLE, RYTHME ---- */}
        <DSMotion />

        <FooterMinimal />
      </PageWrapper>
    </>
  );
}
