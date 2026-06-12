"use client";

import { SectionBlock } from "@/components/ui/SectionBlock";
import { useTheme } from "@/lib/theme";

/*
 * Valeurs hexadécimales affichées à titre purement documentaire (référence
 * des tokens pour les designers) — elles ne stylent rien : le rendu des
 * nuanciers passe exclusivement par les classes `bg-*` du design system.
 */
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

/** Section "Palette de couleurs" de la page design-system. */
export function DSPalette() {
  const { theme } = useTheme();
  const COLORS = theme === "light" ? COLORS_LIGHT : COLORS_DARK;

  return (
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
  );
}
