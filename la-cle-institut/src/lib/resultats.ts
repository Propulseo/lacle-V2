/**
 * Indicateurs de résultats publics (Qualiopi indicateur 2).
 * Affichés sur la page de vente via <FormationResultats />.
 *
 * FAKEDATA PROVISOIRE : valeurs à remplacer par les chiffres réels, puis à
 * brancher sur le LMS / Supabase pour une mise à jour automatique.
 *
 * // TODO // Supabase: query agrégée (réussite examens, complétion, satisfaction,
 * //   nombre d'apprenants) exposée en lecture publique pour ce widget.
 * // TODO // Qualiopi Ind.2: ces chiffres doivent être réels et exportables (CSV/PDF) côté LMS.
 */
export interface ResultatsQualiopi {
  /** Satisfaction moyenne sur 5. */
  satisfactionSur5: number;
  /** Taux de réussite à l'examen final, en %. */
  tauxReussite: number;
  /** Taux de complétion du parcours, en %. */
  tauxCompletion: number;
  /** Nombre d'apprenants formés. */
  nombreApprenants: number;
  /** Taux de recommandation, en %. */
  tauxRecommandation: number;
}

/** Données provisoires (fakedata) pour le parcours Praticien PNL. */
export const RESULTATS_PNL: ResultatsQualiopi = {
  satisfactionSur5: 4.8,
  tauxReussite: 92,
  tauxCompletion: 87,
  nombreApprenants: 12,
  tauxRecommandation: 95,
};
