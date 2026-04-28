import { mockSettings } from "@/data/mock/settings";
import type { Settings } from "@/types";
import { sleep } from "@/lib/utils";

let settings = { ...mockSettings };

/**
 * Recupere les reglages globaux de la plateforme.
 *
 * @returns Les reglages actuels
 */
export async function getSettings(): Promise<Settings> {
  await sleep(200);
  return { ...settings };
}

/**
 * Met a jour les reglages globaux de la plateforme.
 *
 * @param data - Champs a modifier
 * @returns Les reglages mis a jour
 */
export async function updateSettings(data: Partial<Settings>): Promise<Settings> {
  await sleep(300);
  settings = { ...settings, ...data };
  return { ...settings };
}
