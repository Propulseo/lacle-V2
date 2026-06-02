/**
 * Constantes de conformité Qualiopi.
 *
 * Ce fichier centralise les données réglementaires qui doivent pouvoir être
 * mises à jour rapidement et sans dépendance technique :
 *  - la date de dernière actualisation des pages de vente
 *    (indicateur 1 : information accessible au public sur les prestations)
 *  - les coordonnées du référent handicap
 *    (indicateur 26 : accueil des publics en situation de handicap)
 *
 * À modifier à chaque revue de contenu pédagogique ou changement de référent.
 */

/** Format libre, affiché tel quel : "mai 2026", "Q3 2026", etc. */
export const PAGE_LAST_UPDATED = "juin 2026";

/** Email unique de contact du référent handicap de l'institut. */
export const HANDICAP_REFERENT_EMAIL = "contact@institutlacle.fr";

/**
 * Tarif de la formation Praticien PNL.
 * Affiché a minima sur la page de vente (Qualiopi Ind.1 : tarif accessible
 * au public). Décision Marien : on affiche au minimum.
 */
export const FORMATION_PRICE = "2 200 € TTC";
