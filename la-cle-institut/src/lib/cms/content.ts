import { getContentValue, getCollectionItems } from "./queries";
import type { PnlModule, FaqItem, ResultatsQualiopi } from "./types";
import { PNL_MODULES, PNL_FAQ } from "@/lib/pnl-content";
import { RESULTATS_PNL } from "@/lib/resultats";
import { PAGE_LAST_UPDATED, FORMATION_PRICE } from "@/lib/qualiopi";

/**
 * Getters typés du contenu éditable de la page formation Praticien PNL.
 * Chacun surcharge le défaut en dur quand Supabase expose une ligne, et
 * retombe sur le fallback sinon (cf. queries.ts, qui ne lève jamais).
 */

export function getResultatsPnl(): Promise<ResultatsQualiopi> {
  return getContentValue("resultats_pnl", RESULTATS_PNL);
}

export function getPageLastUpdated(): Promise<string> {
  return getContentValue("page_last_updated", PAGE_LAST_UPDATED);
}

export function getFormationPrice(): Promise<string> {
  return getContentValue("formation_price", FORMATION_PRICE);
}

export function getPnlModules(): Promise<PnlModule[]> {
  return getCollectionItems("modules_pnl", PNL_MODULES);
}

export function getPnlFaq(): Promise<FaqItem[]> {
  return getCollectionItems("faq", PNL_FAQ);
}
