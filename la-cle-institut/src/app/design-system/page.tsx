"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { FooterMinimal } from "@/components/layout/FooterMinimal";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/Button";
import { HubCard } from "@/components/ui/HubCard";
import { SectionBlock } from "@/components/ui/SectionBlock";
import { HeroSection } from "@/components/ui/HeroSection";
import { Expandable } from "@/components/ui/Expandable";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { FormationCard } from "@/components/ui/FormationCard";
import { ModuleCard } from "@/components/ui/ModuleCard";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { KeySymbol } from "@/components/splash/KeySymbol";
import { SplashScreen } from "@/components/splash/SplashScreen";
import { useTheme } from "@/lib/theme";

const COLORS_DARK = [
  { name: "Noir", token: "noir", hex: "#0B0B0B", bg: "bg-noir" },
  { name: "Graphite", token: "graphite", hex: "#131313", bg: "bg-graphite" },
  { name: "Ardoise", token: "ardoise", hex: "#1A1A1A", bg: "bg-ardoise" },
  { name: "Charbon", token: "charbon", hex: "#222222", bg: "bg-charbon" },
  { name: "Ivoire", token: "ivoire", hex: "#F5F0EB", bg: "bg-ivoire" },
  { name: "Cendre", token: "cendre", hex: "#A09A93", bg: "bg-cendre" },
  { name: "Pierre", token: "pierre", hex: "#6B665F", bg: "bg-pierre" },
  { name: "Bronze", token: "bronze", hex: "#B08D57", bg: "bg-bronze" },
  { name: "Bronze clair", token: "bronze-clair", hex: "#C9A96E", bg: "bg-bronze-clair" },
  { name: "Filet", token: "filet", hex: "#2A2A2A", bg: "bg-filet" },
  { name: "Filet accent", token: "filet-accent", hex: "#3D3530", bg: "bg-filet-accent" },
];

const COLORS_LIGHT = [
  { name: "Noir", token: "noir", hex: "#F7F3ED", bg: "bg-noir" },
  { name: "Graphite", token: "graphite", hex: "#D8CCB8", bg: "bg-graphite" },
  { name: "Ardoise", token: "ardoise", hex: "#FEFCF8", bg: "bg-ardoise" },
  { name: "Charbon", token: "charbon", hex: "#CFC3B0", bg: "bg-charbon" },
  { name: "Ivoire", token: "ivoire", hex: "#1A1714", bg: "bg-ivoire" },
  { name: "Cendre", token: "cendre", hex: "#52493E", bg: "bg-cendre" },
  { name: "Pierre", token: "pierre", hex: "#8E857A", bg: "bg-pierre" },
  { name: "Bronze", token: "bronze", hex: "#9A7B44", bg: "bg-bronze" },
  { name: "Bronze clair", token: "bronze-clair", hex: "#876A38", bg: "bg-bronze-clair" },
  { name: "Filet", token: "filet", hex: "#C8BBA8", bg: "bg-filet" },
  { name: "Filet accent", token: "filet-accent", hex: "#B0A08A", bg: "bg-filet-accent" },
];

const FAQ_ITEMS = [
  { question: "Qu'est-ce que la PNL telle qu'enseignée par La Clé ?", answer: "La PNL est un cadre de compréhension des mécanismes cognitifs et comportementaux. Chez La Clé, elle est enseignée comme un outil d'observation et de compréhension, jamais comme une technique de manipulation ou de transformation rapide." },
  { question: "Le parcours est-il entièrement à distance ?", answer: "Le parcours combine une phase distancielle structurée et une phase présentielle intensive. La partie distancielle pose les fondations théoriques, le présentiel permet l'intégration pratique." },
  { question: "Faut-il des prérequis pour s'inscrire ?", answer: "Aucun prérequis académique n'est nécessaire. La formation s'adresse à toute personne souhaitant comprendre les mécanismes humains avec rigueur et profondeur." },
];

export default function DesignSystemPage() {
  const [showSplash, setShowSplash] = useState(false);
  const { theme } = useTheme();
  const COLORS = theme === "light" ? COLORS_LIGHT : COLORS_DARK;

  return (
    <>
      <SplashScreen isVisible={showSplash} onComplete={() => setShowSplash(false)} />
      <Header showBack backHref="/" backLabel="Accueil" />
      <PageWrapper>
        {/* ---- HERO ---- */}
        <HeroSection
          title="Design System"
          subtitle="Institut La Clé — Tokens, composants et patterns du système de design institutionnel."
        />

        {/* ---- PALETTE ---- */}
        <SectionBlock background="graphite">
          <h2 className="mb-8">Palette de couleurs</h2>
          <p className="mb-12 text-sm text-cendre">
            Thème actif : <span className="text-bronze">{theme}</span>
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {COLORS.map((c) => (
              <div key={c.token} className="space-y-2">
                <div className={`h-20 rounded-sm border border-filet ${c.bg}`} />
                <p className="text-xs text-ivoire">{c.name}</p>
                <p className="font-mono text-xs text-pierre">{c.hex}</p>
              </div>
            ))}
          </div>
        </SectionBlock>

        {/* ---- TYPOGRAPHIE ---- */}
        <SectionBlock>
          <h2 className="mb-12">Typographie</h2>

          {/* Headings hierarchy */}
          <div className="space-y-8 border-b border-filet pb-12">
            <div>
              <p className="mb-2 text-xs uppercase tracking-widest text-pierre">H1 — Cormorant Garamond · 600 · -0.02em</p>
              <h1>Comprendre les mécanismes</h1>
            </div>
            <div>
              <p className="mb-2 text-xs uppercase tracking-widest text-pierre">H2 · 600 · -0.015em</p>
              <h2>L&apos;institut de compréhension</h2>
            </div>
            <div>
              <p className="mb-2 text-xs uppercase tracking-widest text-pierre">H3 · 600 · -0.01em</p>
              <h3>Une pédagogie structurée</h3>
            </div>
            <div>
              <p className="mb-2 text-xs uppercase tracking-widest text-pierre">H4 · 600 · -0.01em</p>
              <h4>Le cadre méthodologique</h4>
            </div>
            <div>
              <p className="mb-2 text-xs uppercase tracking-widest text-pierre">H5 · 600</p>
              <h5>Sous-section complémentaire</h5>
            </div>
            <div>
              <p className="mb-2 text-xs uppercase tracking-widest text-pierre">H6 · 600</p>
              <h6>Note de contexte</h6>
            </div>
          </div>

          {/* Semantic presets */}
          <div className="mt-12 space-y-10 border-b border-filet pb-12">
            <p className="text-xs uppercase tracking-widest text-pierre">Presets sémantiques</p>

            <div>
              <p className="mb-3 text-xs text-pierre"><code className="rounded bg-charbon px-2 py-0.5 font-mono text-bronze-clair">.text-display</code></p>
              <p className="text-display text-ivoire">Impact visuel</p>
            </div>

            <div>
              <p className="mb-3 text-xs text-pierre"><code className="rounded bg-charbon px-2 py-0.5 font-mono text-bronze-clair">.text-label</code></p>
              <p className="text-label text-bronze">Label institutionnel — 10px</p>
            </div>

            <div>
              <p className="mb-3 text-xs text-pierre"><code className="rounded bg-charbon px-2 py-0.5 font-mono text-bronze-clair">.text-label-sm</code></p>
              <p className="text-label-sm text-pierre">Label compact — 9px</p>
            </div>

            <div>
              <p className="mb-3 text-xs text-pierre"><code className="rounded bg-charbon px-2 py-0.5 font-mono text-bronze-clair">.text-quote</code></p>
              <p className="text-quote text-cendre">La compréhension précède toujours l&apos;action efficace.</p>
            </div>
          </div>

          {/* Hierarchy table */}
          <div className="mt-12 overflow-x-auto border-b border-filet pb-12">
            <p className="mb-6 text-xs uppercase tracking-widest text-pierre">Hiérarchie typographique</p>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-filet text-xs uppercase tracking-widest text-pierre">
                  <th className="pb-3 pr-6">Niveau</th>
                  <th className="pb-3 pr-6">Poids</th>
                  <th className="pb-3 pr-6">Taille (clamp)</th>
                  <th className="pb-3 pr-6">Line-height</th>
                  <th className="pb-3">Spacing</th>
                </tr>
              </thead>
              <tbody className="text-cendre">
                <tr className="border-b border-filet-discret"><td className="py-3 pr-6 text-ivoire">h1</td><td className="py-3 pr-6">600</td><td className="py-3 pr-6">2.5rem → 4.5rem</td><td className="py-3 pr-6">1.08</td><td className="py-3">-0.02em</td></tr>
                <tr className="border-b border-filet-discret"><td className="py-3 pr-6 text-ivoire">h2</td><td className="py-3 pr-6">600</td><td className="py-3 pr-6">2rem → 3.5rem</td><td className="py-3 pr-6">1.12</td><td className="py-3">-0.015em</td></tr>
                <tr className="border-b border-filet-discret"><td className="py-3 pr-6 text-ivoire">h3</td><td className="py-3 pr-6">600</td><td className="py-3 pr-6">1.5rem → 2.25rem</td><td className="py-3 pr-6">1.2</td><td className="py-3">-0.01em</td></tr>
                <tr className="border-b border-filet-discret"><td className="py-3 pr-6 text-ivoire">h4</td><td className="py-3 pr-6">600</td><td className="py-3 pr-6">1.25rem → 1.75rem</td><td className="py-3 pr-6">1.25</td><td className="py-3">-0.01em</td></tr>
                <tr className="border-b border-filet-discret"><td className="py-3 pr-6 text-ivoire">h5</td><td className="py-3 pr-6">600</td><td className="py-3 pr-6">1.25rem</td><td className="py-3 pr-6">1.3</td><td className="py-3">0</td></tr>
                <tr><td className="py-3 pr-6 text-ivoire">h6</td><td className="py-3 pr-6">600</td><td className="py-3 pr-6">1.125rem</td><td className="py-3 pr-6">1.3</td><td className="py-3">0</td></tr>
              </tbody>
            </table>
          </div>

          {/* Body text */}
          <div className="mt-12 max-w-2xl space-y-6">
            <p className="mb-2 text-xs uppercase tracking-widest text-pierre">Corps — Libre Franklin</p>
            <p>
              L&apos;institut La Clé propose une approche rigoureuse de la compréhension des mécanismes humains.
              Il ne s&apos;agit pas d&apos;une promesse de transformation, mais d&apos;un cadre structuré pour
              observer, comprendre et maîtriser les dynamiques cognitives et comportementales.
            </p>
            <p className="text-sm text-pierre">
              Texte secondaire — utilisé pour les métadonnées, labels et informations complémentaires
              qui ne constituent pas le contenu principal de la page.
            </p>
          </div>
        </SectionBlock>

        {/* ---- BOUTONS ---- */}
        <SectionBlock background="graphite">
          <h2 className="mb-12">Boutons</h2>
          <div className="space-y-10">
            <div>
              <p className="mb-6 text-xs uppercase tracking-widest text-pierre">Default</p>
              <div className="flex flex-wrap items-center gap-6">
                <Button>Découvrir</Button>
                <Button size="large">Accéder à l&apos;espace</Button>
              </div>
            </div>
            <div>
              <p className="mb-6 text-xs uppercase tracking-widest text-pierre">Ghost</p>
              <div className="flex flex-wrap items-center gap-6">
                <Button variant="ghost">En savoir plus</Button>
                <Button variant="ghost" size="large">Voir les formations</Button>
              </div>
            </div>
          </div>
        </SectionBlock>

        {/* ---- SYMBOLE CLÉ ---- */}
        <SectionBlock>
          <h2 className="mb-12">Symbole &amp; Splash</h2>
          <div className="flex flex-col items-center gap-12 md:flex-row md:items-start">
            <div className="flex flex-col items-center gap-4">
              <KeySymbol className="h-32 w-auto text-ivoire" animate={false} />
              <p className="text-xs text-pierre">Symbole statique</p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <KeySymbol className="h-32 w-auto text-ivoire" animate />
              <p className="text-xs text-pierre">Animation stroke draw</p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={() => setShowSplash(true)}
                className="border border-filet px-6 py-3 text-xs uppercase tracking-widest text-cendre transition-colors duration-300 hover:border-bronze hover:text-ivoire"
              >
                Jouer le splash
              </button>
              <p className="text-xs text-pierre">Splash screen 1.8s</p>
            </div>
          </div>
        </SectionBlock>

        {/* ---- CARDS HUB ---- */}
        <SectionBlock background="graphite">
          <h2 className="mb-12">Cartes Hub</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <HubCard title="Notre vocation" description="Comprendre le pourquoi profond de l'institut et sa mission de compréhension." href="#" />
            <HubCard title="Le concept" description="Le cadre méthodologique et la distinction compréhension versus transformation." href="#" />
            <HubCard title="L'équipe" description="Les garants pédagogiques et l'origine de l'institut La Clé." href="#" />
          </div>
        </SectionBlock>

        {/* ---- CARDS FORMATION ---- */}
        <SectionBlock>
          <h2 className="mb-12">Cartes Formation</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <FormationCard
              title="PNL — Praticien"
              description="Formation complète de praticien PNL. Parcours distanciel structuré suivi d'une phase présentielle intensive."
              href="#"
              available
              label="Disponible"
            />
            <FormationCard
              title="PNL — Maître Praticien"
              description="Approfondissement des mécanismes avancés de la PNL. Suite logique du parcours praticien."
              available={false}
              label="À venir"
            />
          </div>
        </SectionBlock>

        {/* ---- MODULE CARDS ---- */}
        <SectionBlock background="graphite">
          <h2 className="mb-12">Modules</h2>
          <div className="max-w-2xl">
            <ModuleCard number={1} title="Les fondations de la PNL" description="Origines, principes fondateurs et cadre épistémologique de la programmation neuro-linguistique." />
            <ModuleCard number={2} title="Systèmes de représentation" description="Comprendre les modalités sensorielles et leur influence sur la perception et la communication." />
            <ModuleCard number={3} title="Le méta-modèle" description="Structure du langage et outils de précision linguistique pour une compréhension approfondie." />
          </div>
        </SectionBlock>

        {/* ---- SCROLL REVEAL ---- */}
        <SectionBlock>
          <h2 className="mb-12">Scroll Reveal</h2>
          <div className="space-y-8">
            <ScrollReveal>
              <div className="border border-filet p-8">
                <p className="text-cendre">Ce bloc apparaît avec un fade-in vertical au scroll.</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.15}>
              <div className="border border-filet p-8">
                <p className="text-cendre">Deuxième bloc avec délai de 150ms.</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.3}>
              <div className="border border-filet p-8">
                <p className="text-cendre">Troisième bloc avec délai de 300ms.</p>
              </div>
            </ScrollReveal>
          </div>
        </SectionBlock>

        {/* ---- EXPANDABLE ---- */}
        <SectionBlock background="graphite">
          <h2 className="mb-12">Expandable &amp; FAQ</h2>
          <div className="max-w-2xl">
            <p className="mb-6 text-xs uppercase tracking-widest text-pierre">Bloc dépliable</p>
            <Expandable title="Parcours du fondateur">
              <p>
                Marien a consacré plus de quinze années à l&apos;étude des mécanismes cognitifs
                et comportementaux. Son parcours l&apos;a mené de la pratique clinique à
                l&apos;enseignement structuré, avec une conviction constante : la compréhension
                précède toujours l&apos;action efficace.
              </p>
            </Expandable>
            <Expandable title="Philosophie pédagogique">
              <p>
                La pédagogie de La Clé repose sur un principe fondamental : chaque concept
                doit être compris dans sa profondeur avant d&apos;être mis en pratique.
                Le rythme est volontairement progressif.
              </p>
            </Expandable>
          </div>
          <div className="mt-16 max-w-2xl">
            <p className="mb-6 text-xs uppercase tracking-widest text-pierre">FAQ Accordéon</p>
            <FAQAccordion items={FAQ_ITEMS} />
          </div>
        </SectionBlock>

        {/* ---- SECTION BLOCK DEMO ---- */}
        <SectionBlock>
          <h2 className="mb-6">Section type — Rythme vertical</h2>
          <p className="mb-12 max-w-2xl">
            Chaque section respecte un rythme vertical généreux : 80px mobile, 112px tablette,
            128px desktop. La respiration entre les blocs est un élément fondamental du design system.
          </p>
          <div className="grid gap-px border border-filet md:grid-cols-3">
            <div className="bg-graphite p-10">
              <p className="text-xs uppercase tracking-widest text-bronze">py-20</p>
              <p className="mt-2 text-sm text-cendre">80px — Mobile</p>
            </div>
            <div className="bg-graphite p-10">
              <p className="text-xs uppercase tracking-widest text-bronze">md:py-28</p>
              <p className="mt-2 text-sm text-cendre">112px — Tablette</p>
            </div>
            <div className="bg-graphite p-10">
              <p className="text-xs uppercase tracking-widest text-bronze">lg:py-32</p>
              <p className="mt-2 text-sm text-cendre">128px — Desktop</p>
            </div>
          </div>
        </SectionBlock>

        <FooterMinimal />
      </PageWrapper>
    </>
  );
}
