import { PARCOURS } from "@/lib/formations";
import { ParcoursTable } from "./ParcoursTable";

/**
 * Catalogue des formations, organisé par parcours (retour A14).
 * Un tableau séquentiel par parcours (PNL, Analyse Transactionnelle,
 * Systémique...) : les étapes se lisent dans l'ordre du cursus, chacune
 * portant sa modalité, son délivrable et son statut (retour 10).
 * Source de vérité : src/lib/formations.ts (PARCOURS).
 */
export function FormationCarousel() {
  return (
    <div className="flex flex-col gap-20 md:gap-28">
      <p className="text-label tracking-[0.25em] text-pierre">
        {PARCOURS.length} parcours
      </p>
      {PARCOURS.map((parcours) => (
        <ParcoursTable key={parcours.id} parcours={parcours} />
      ))}
    </div>
  );
}
