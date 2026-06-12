import { SectionBlock } from "@/components/ui/SectionBlock";

/** Section "Typographie" de la page design-system. */
export function DSTypography() {
  return (
    <SectionBlock>
      <h2 className="mb-12">Typographie</h2>

      {/* Headings hierarchy */}
      <div className="space-y-8 border-b border-filet pb-12">
        <div>
          <p className="mb-2 text-xs uppercase tracking-widest text-pierre">H1 — Cormorant Garamond · 600 · -0.02em</p>
          {/* Démo typographique : élément non sémantique stylé comme un h1
              pour éviter un second <h1> sur la page (le seul vrai <h1>
              est porté par le HeroSection). Valeurs alignées sur la règle
              `h1` de globals.css. */}
          <p className="font-display font-semibold leading-[1.08] tracking-[-0.02em] text-ivoire text-[clamp(2.5rem,5vw,4.5rem)]">
            Comprendre les mécanismes
          </p>
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
          L&apos;institut La Clé propose une approche exigeante de la compréhension des mécanismes humains.
          Il ne s&apos;agit pas d&apos;une promesse de transformation, mais d&apos;un cadre structuré pour
          observer, comprendre et maîtriser les dynamiques cognitives et comportementales.
        </p>
        <p className="text-sm text-pierre">
          Texte secondaire — utilisé pour les métadonnées, labels et informations complémentaires
          qui ne constituent pas le contenu principal de la page.
        </p>
      </div>
    </SectionBlock>
  );
}
