import { PARCOURS } from "@/lib/formations";
import { ParcoursRoue } from "./ParcoursRoue";

/**
 * Catalogue des formations, organisé par parcours (retour A14).
 * Une roue par parcours (PNL, Analyse Transactionnelle, Systémique...),
 * chaque étape portant son badge de statut et sa modalité.
 * Source de vérité : src/lib/formations.ts (PARCOURS).
 */
export function FormationCarousel() {
  return (
    <div className="flex flex-col gap-20 md:gap-28">
      <p className="text-label tracking-[0.25em] text-pierre">
        {PARCOURS.length} parcours
      </p>
      {PARCOURS.map((parcours) => (
        <ParcoursRoue key={parcours.id} parcours={parcours} />
      ))}
    </div>
  );
}
