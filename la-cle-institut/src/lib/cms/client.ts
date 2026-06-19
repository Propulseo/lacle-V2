import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Crée un client Supabase en lecture publique (anon) pour le CMS vitrine.
 *
 * Retourne `null` si les variables d'environnement ne sont pas définies :
 * le site doit fonctionner à l'identique sans Supabase (fallback en dur).
 * Aucune dépendance aux cookies ici (pas de @supabase/ssr) : lecture anon
 * uniquement, filtrée par les politiques RLS publiques.
 */
export function getCmsClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}
