// Service revision — cable Supabase (table revision_resources) avec adaptateur
// vers le DTO RevisionResource (pages inchangees).
// Mapping direct snake_case -> camelCase ; bloc_id <-> moduleId.
import { createClient } from "@/lib/supabase/client";
import type { RevisionResource } from "@/types";
import type { Database } from "@/types/database.types";

type RevisionRow = Database["public"]["Tables"]["revision_resources"]["Row"];

const REVISION_SELECT = "id, type, title, description, content, answer, bloc_id, created_at";

function mapResource(r: RevisionRow): RevisionResource {
  return {
    id: r.id,
    type: r.type,
    title: r.title,
    description: r.description ?? "",
    content: r.content,
    answer: r.answer ?? undefined,
    moduleId: r.bloc_id,
    createdAt: r.created_at,
  };
}

/**
 * Recupere toutes les ressources du coffre de revision (fiches, questions, videos).
 *
 * @returns Tableau des ressources de revision
 */
export async function getRevisionResources(): Promise<RevisionResource[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("revision_resources")
    .select(REVISION_SELECT)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return ((data as RevisionRow[]) ?? []).map(mapResource);
}

/**
 * Cree une nouvelle ressource de revision.
 *
 * @param data - Donnees de la ressource (sans id ni createdAt)
 * @returns La ressource creee
 */
export async function createRevisionResource(
  data: Omit<RevisionResource, "id" | "createdAt">
): Promise<RevisionResource> {
  const supabase = createClient();
  const insert: Database["public"]["Tables"]["revision_resources"]["Insert"] = {
    type: data.type,
    title: data.title,
    description: data.description,
    content: data.content,
    answer: data.answer ?? null,
    bloc_id: data.moduleId,
  };
  const { data: row, error } = await supabase
    .from("revision_resources")
    .insert(insert)
    .select(REVISION_SELECT)
    .single();
  if (error) throw error;
  return mapResource(row as RevisionRow);
}

/**
 * Met a jour une ressource de revision existante.
 *
 * @param id - Identifiant de la ressource
 * @param data - Champs a modifier
 * @returns La ressource mise a jour
 * @throws Si la ressource n'existe pas
 */
export async function updateRevisionResource(
  id: string,
  data: Partial<RevisionResource>
): Promise<RevisionResource> {
  const supabase = createClient();
  const patch: Database["public"]["Tables"]["revision_resources"]["Update"] = {};
  if (data.type !== undefined) patch.type = data.type;
  if (data.title !== undefined) patch.title = data.title;
  if (data.description !== undefined) patch.description = data.description;
  if (data.content !== undefined) patch.content = data.content;
  if (data.answer !== undefined) patch.answer = data.answer ?? null;
  if (data.moduleId !== undefined) patch.bloc_id = data.moduleId;
  const { data: row, error } = await supabase
    .from("revision_resources")
    .update(patch)
    .eq("id", id)
    .select(REVISION_SELECT)
    .single();
  if (error) throw error;
  return mapResource(row as RevisionRow);
}

/**
 * Supprime une ressource de revision.
 *
 * @param id - Identifiant de la ressource
 * @throws Si la ressource n'existe pas
 */
export async function deleteRevisionResource(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("revision_resources").delete().eq("id", id);
  if (error) throw error;
}
