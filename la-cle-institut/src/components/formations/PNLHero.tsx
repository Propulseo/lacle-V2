import { ScrollReveal } from "@/components/ui/ScrollReveal";

/* Chiffres sourcés : « Architecture des cours » (7 phases, cours 1 à 60) et
   ATTESTATION DE FIN DE FORMATION.docx (« 7 modules pédagogiques, 60 leçons
   vidéo »). L'ancien « 10 compétences clés » ne venait d'aucun document. */
const METRICS = [
  { value: "7", label: "Modules distanciels" },
  { value: "60", label: "Cours vidéo" },
  { value: "1", label: "Attestation délivrée" },
];

/** Hero cinématique de la page de vente PNL Praticien (titre + métriques). */
export function PNLHero() {
  return (
    <section className="relative flex min-h-[90vh] flex-col justify-center overflow-hidden pb-20 pt-32 md:pb-28 md:pt-40">
      <div
        className="absolute inset-0 bg-gradient-to-b from-graphite/40 via-noir to-noir"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_35%,rgba(176,141,87,0.04),transparent)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-[1200px] px-6 md:px-10 lg:px-16">
        <ScrollReveal>
          <p className="text-label tracking-[0.3em] text-bronze">
            Formation à distance
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <h1 className="mt-6 max-w-4xl font-display text-5xl font-semibold leading-[1.02] text-ivoire md:text-7xl lg:text-8xl xl:text-[6.5rem]">
            Pré-praticien PNL
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="mt-12 flex items-start gap-6 md:mt-16">
            <div className="mt-3 hidden h-px w-20 shrink-0 bg-gradient-to-r from-bronze/60 to-transparent md:block" />
            <p className="max-w-xl text-lg leading-relaxed text-cendre md:text-xl">
              Comprendre les mécanismes fondamentaux de la Programmation
              Neuro-Linguistique avec exigence et profondeur.
            </p>
          </div>
        </ScrollReveal>

        {/* Métriques */}
        <ScrollReveal delay={0.3}>
          <div className="mt-20 grid grid-cols-1 gap-6 border-t border-filet/60 pt-10 sm:grid-cols-3 sm:gap-8 md:mt-24 md:max-w-lg md:gap-16">
            {METRICS.map((m) => (
              <div key={m.label}>
                <span className="block font-display text-4xl font-light text-ivoire md:text-5xl">
                  {m.value}
                </span>
                <p className="mt-2 text-[0.65rem] uppercase tracking-[0.12em] text-pierre md:text-xs md:tracking-widest">
                  {m.label}
                </p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
