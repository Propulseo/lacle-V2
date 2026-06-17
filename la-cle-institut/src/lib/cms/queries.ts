import { getCmsClient } from "./client";
import type { SiteCollectionType } from "./types";

/**
 * Requêtes CMS bas niveau. Règle absolue : ne JAMAIS lever d'exception.
 * En l'absence de client, sur erreur, ou si le résultat est vide, on retourne
 * le `fallback` fourni (contenu en dur). Supabase ne fait que surcharger.
 */

/** Lit une valeur unique de site_content, sinon retourne le fallback. */
export async function getContentValue<T>(key: string, fallback: T): Promise<T> {
  const client = getCmsClient();
  if (!client) return fallback;
  try {
    const { data, error } = await client
      .from("site_content")
      .select("value")
      .eq("key", key)
      .maybeSingle();
    if (error || !data || data.value === null || data.value === undefined) {
      return fallback;
    }
    return data.value as T;
  } catch {
    return fallback;
  }
}

/**
 * Lit les items d'une collection (ordonnés par position), sinon le fallback.
 * La RLS publique filtre déjà les items non publiés pour anon.
 */
export async function getCollectionItems<T>(
  type: SiteCollectionType,
  fallback: T[],
): Promise<T[]> {
  const client = getCmsClient();
  if (!client) return fallback;
  try {
    const { data, error } = await client
      .from("site_collections")
      .select("data")
      .eq("type", type)
      .order("position", { ascending: true });
    if (error || !data || data.length === 0) return fallback;
    return data.map((row) => row.data as T);
  } catch {
    return fallback;
  }
}
