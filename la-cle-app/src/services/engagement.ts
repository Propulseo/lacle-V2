import { mockEngagementLearners } from "@/data/mock/engagement";
import type { EngagementLearner } from "@/types";
import { sleep } from "@/lib/utils";

const learners = [...mockEngagementLearners];

/**
 * Recupere les apprenants avec leurs donnees d'engagement (anti-decrochage).
 * Inclut le statut d'engagement, les dates de derniere activite et les relances.
 *
 * @returns Apprenants avec tracking d'engagement
 */
// TODO // Supabase: remplacer par query sur students + engagement_tracking
export async function getEngagementLearners(): Promise<EngagementLearner[]> {
  await sleep(300);
  return [...learners];
}

/**
 * Compte les apprenants en situation d'abandon (inactifs depuis 42 jours).
 *
 * @param list - Liste des apprenants avec engagement
 * @returns Nombre d'apprenants en abandon
 */
export function getAbandonCount(list: EngagementLearner[]): number {
  return list.filter((l) => l.engagement.status === "inactif_42j").length;
}
