import { RESULTATS_PNL } from "@/lib/resultats";
import { PAGE_LAST_UPDATED } from "@/lib/qualiopi";

/**
 * Widget « Nos indicateurs qualité » (Qualiopi indicateur 2).
 * Alimenté par des fakedata typées (src/lib/resultats.ts), structuré pour un
 * branchement Supabase / LMS ultérieur. Responsive : 2 colonnes sur mobile,
 * 4 sur écran large (pas de chevauchement de libellés).
 */
const STATS: { value: string; label: string }[] = [
  { value: `${RESULTATS_PNL.satisfactionSur5}/5`, label: "Satisfaction moyenne" },
  { value: `${RESULTATS_PNL.tauxReussite}%`, label: "Taux de réussite" },
  { value: `${RESULTATS_PNL.tauxCompletion}%`, label: "Taux de complétion" },
  { value: `${RESULTATS_PNL.tauxRecommandation}%`, label: "Recommandation" },
];

export function FormationResultats() {
  return (
    <div>
      <p className="mb-3 text-label tracking-[0.25em] text-bronze/70">Qualité</p>
      <h2 className="mb-10 font-display text-3xl text-ivoire md:text-4xl">
        Nos indicateurs qualité
      </h2>

      <div className="grid grid-cols-2 gap-px border border-filet bg-filet sm:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="bg-graphite/40 p-6 md:p-8">
            <span className="block font-display text-3xl font-light text-bronze md:text-4xl">
              {stat.value}
            </span>
            <p className="mt-2 text-[0.65rem] uppercase tracking-[0.12em] text-pierre md:text-xs md:tracking-[0.15em]">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-6 text-[0.65rem] uppercase tracking-[0.3em] text-pierre/60">
        Indicateurs mis à jour en {PAGE_LAST_UPDATED}
      </p>
    </div>
  );
}
