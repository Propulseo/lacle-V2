// Service CMS vitrine — cable Supabase (tables site_content + site_collections).
// Lecture publique (RLS anon), ecriture reservee au staff (is_staff). Le trigger DB
// positionne updated_by et archive les versions : NE JAMAIS envoyer updated_by ici.
import { createClient } from "@/lib/supabase/client";
import type { Database, Json } from "@/types/database.types";

export type SiteContentRow = Database["public"]["Tables"]["site_content"]["Row"];
export type SiteCollectionRow =
  Database["public"]["Tables"]["site_collections"]["Row"];
export type SiteCollectionType =
  Database["public"]["Enums"]["site_collection_type"];

export type { Json };

/**
 * Liste toutes les valeurs editables du CMS (site_content), triees par groupe puis cle.
 */
export async function listSiteContent(): Promise<SiteContentRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("site_content")
    .select("*")
    .order("group_name", { ascending: true })
    .order("key", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

/**
 * Enregistre la valeur d'une cle site_content (staff uniquement, RLS).
 * Upsert (onConflict key) : cree la ligne si elle n'existe pas encore en base
 * (label/group_name issus du registre, colonnes NOT NULL), sinon met a jour la
 * valeur. Robuste meme sans seed prealable. Le trigger DB gere updated_by.
 */
export async function updateSiteContent(
  key: string,
  value: Json,
  meta: { label: string; group: string }
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("site_content")
    .upsert(
      { key, value, label: meta.label, group_name: meta.group },
      { onConflict: "key" }
    );
  if (error) throw error;
}

/**
 * Liste les items d'une collection (modules_pnl, faq…), tries par position croissante.
 */
export async function listCollection(
  type: SiteCollectionType
): Promise<SiteCollectionRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("site_collections")
    .select("*")
    .eq("type", type)
    .order("position", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

/**
 * Cree un item de collection. Le trigger DB gere updated_by.
 */
export async function createCollectionItem(
  type: SiteCollectionType,
  data: Json,
  position: number
): Promise<SiteCollectionRow> {
  const supabase = createClient();
  const { data: row, error } = await supabase
    .from("site_collections")
    .insert({ type, data, position })
    .select("*")
    .single();
  if (error) throw error;
  return row;
}

/**
 * Met a jour le contenu (data jsonb) d'un item de collection.
 */
export async function updateCollectionItem(id: string, data: Json): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("site_collections")
    .update({ data })
    .eq("id", id);
  if (error) throw error;
}

/**
 * Publie ou depublie un item (controle la visibilite publique cote vitrine).
 */
export async function setItemPublished(
  id: string,
  published: boolean
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("site_collections")
    .update({ published })
    .eq("id", id);
  if (error) throw error;
}

/**
 * Supprime definitivement un item de collection.
 */
export async function deleteCollectionItem(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("site_collections")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

/**
 * Calcule la nouvelle position d'un item pour le deplacer d'un cran (haut/bas).
 * Strategie fractionnaire : moyenne entre les deux voisins, ou +/-1 aux extremites.
 * Pas de renumerotation globale (une seule ligne mise a jour).
 *
 * @param id - Item a deplacer
 * @param direction - "up" (vers une position plus petite) ou "down"
 * @param ordered - Liste deja triee par position croissante
 */
export async function moveItem(
  id: string,
  direction: "up" | "down",
  ordered: SiteCollectionRow[]
): Promise<void> {
  const index = ordered.findIndex((item) => item.id === id);
  if (index === -1) return;

  const target = index + (direction === "up" ? -1 : 1);
  if (target < 0 || target >= ordered.length) return;

  const neighbor = ordered[target];
  const beyond = ordered[target + (direction === "up" ? -1 : 1)];

  let newPosition: number;
  if (beyond) {
    newPosition = (neighbor.position + beyond.position) / 2;
  } else {
    newPosition = neighbor.position + (direction === "up" ? -1 : 1);
  }

  const supabase = createClient();
  const { error } = await supabase
    .from("site_collections")
    .update({ position: newPosition })
    .eq("id", id);
  if (error) throw error;
}
