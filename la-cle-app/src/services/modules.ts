// Service modules — cable Supabase (schema nested) avec adaptateur vers le DTO
// plat LegacyModule/ModuleWithProgress (pages inchangees).
// Un "module" plat == un "bloc" nested. videosCount/totalDuration agreges depuis
// cours > course_items > videos. examId = exams_bloc du bloc.
// NB PostgREST : les embeds 1-a-1 (FK UNIQUE) reviennent en OBJET, pas en tableau
//   -> videos (item_id UNIQUE) et exams_bloc (bloc_id UNIQUE) sont des objets.
import { createClient } from "@/lib/supabase/client";
import { getActiveFormationId } from "@/lib/supabase/formation";
import type { LegacyModule, ModuleWithProgress } from "@/types";
import type { Database } from "@/types/database.types";

type VideoEmbed = { id: string; duration_seconds: number } | null;
type BlocRow = {
  id: string;
  titre: string;
  description: string | null;
  numero: number;
  access_level: LegacyModule["accessLevel"];
  is_published: boolean;
  created_at: string;
  cours: { course_items: { kind: string; videos: VideoEmbed }[] }[];
  exams_bloc: { id: string } | null;
};

const BLOC_SELECT =
  "id, titre, description, numero, access_level, is_published, created_at, cours(course_items(kind, videos(id, duration_seconds))), exams_bloc(id)";

function videoItems(b: BlocRow) {
  return (b.cours ?? []).flatMap((c) => c.course_items ?? []).filter((i) => i.kind === "video");
}

function mapBloc(b: BlocRow): LegacyModule {
  const vids = videoItems(b);
  return {
    id: b.id,
    title: b.titre,
    description: b.description ?? "",
    order: b.numero,
    accessLevel: b.access_level,
    videosCount: vids.length,
    totalDuration: vids.reduce((s, i) => s + (i.videos?.duration_seconds ?? 0), 0),
    isPublished: b.is_published,
    examId: b.exams_bloc?.id ?? null,
    createdAt: b.created_at,
  };
}

/** Tous les modules (blocs) de la formation active, tries par numero. */
export async function getModules(): Promise<LegacyModule[]> {
  const supabase = createClient();
  const formationId = await getActiveFormationId(supabase);
  if (!formationId) return [];
  const { data, error } = await supabase
    .from("blocs")
    .select(BLOC_SELECT)
    .eq("formation_id", formationId)
    .order("numero", { ascending: true });
  if (error) throw error;
  return (data as unknown as BlocRow[]).map(mapBloc);
}

/** Un module (bloc) par id. */
export async function getModule(id: string): Promise<LegacyModule | null> {
  const supabase = createClient();
  const { data, error } = await supabase.from("blocs").select(BLOC_SELECT).eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? mapBloc(data as unknown as BlocRow) : null;
}

/** Cree un module (bloc) dans la formation active. */
export async function createModule(
  data: Omit<LegacyModule, "id" | "createdAt">,
): Promise<LegacyModule> {
  const supabase = createClient();
  const formationId = await getActiveFormationId(supabase);
  if (!formationId) throw new Error("Aucune formation active");
  const { data: row, error } = await supabase
    .from("blocs")
    .insert({
      formation_id: formationId,
      numero: data.order,
      titre: data.title,
      description: data.description,
      position: data.order,
      access_level: data.accessLevel,
      is_published: data.isPublished,
    })
    .select(BLOC_SELECT)
    .single();
  if (error) throw error;
  return mapBloc(row as unknown as BlocRow);
}

/** Met a jour un module (bloc). */
export async function updateModule(id: string, data: Partial<LegacyModule>): Promise<LegacyModule> {
  const supabase = createClient();
  const patch: Database["public"]["Tables"]["blocs"]["Update"] = {};
  if (data.title !== undefined) patch.titre = data.title;
  if (data.description !== undefined) patch.description = data.description;
  if (data.order !== undefined) { patch.numero = data.order; patch.position = data.order; }
  if (data.accessLevel !== undefined) patch.access_level = data.accessLevel;
  if (data.isPublished !== undefined) patch.is_published = data.isPublished;
  const { data: row, error } = await supabase.from("blocs").update(patch).eq("id", id).select(BLOC_SELECT).single();
  if (error) throw error;
  return mapBloc(row as unknown as BlocRow);
}

/** Supprime un module (bloc) — cascade cours/items/videos/exam. */
export async function deleteModule(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("blocs").delete().eq("id", id);
  if (error) throw error;
}

/** Reordonne les modules (deux passes pour eviter les conflits UNIQUE(formation_id,numero)). */
export async function reorderModules(orderedIds: string[]): Promise<void> {
  const supabase = createClient();
  for (let i = 0; i < orderedIds.length; i++) {
    const { error } = await supabase.from("blocs").update({ numero: 1000 + i, position: 1000 + i }).eq("id", orderedIds[i]);
    if (error) throw error;
  }
  for (let i = 0; i < orderedIds.length; i++) {
    const { error } = await supabase.from("blocs").update({ numero: i + 1, position: i + 1 }).eq("id", orderedIds[i]);
    if (error) throw error;
  }
}

/** Modules enrichis de la progression de l'eleve (statut + videos vues + examen). */
export async function getModulesForLearner(learnerId: string): Promise<ModuleWithProgress[]> {
  const supabase = createClient();
  const formationId = await getActiveFormationId(supabase);
  if (!formationId) return [];

  const { data, error } = await supabase
    .from("blocs")
    .select(BLOC_SELECT)
    .eq("formation_id", formationId)
    .order("numero", { ascending: true });
  if (error) throw error;
  const blocs = (data as unknown as BlocRow[]) ?? [];

  const [{ data: bp }, { data: vp }] = await Promise.all([
    supabase.from("bloc_progress").select("bloc_id, status, exam_passed").eq("learner_id", learnerId),
    supabase.from("video_progress").select("video_id, completed").eq("learner_id", learnerId).eq("completed", true),
  ]);
  const progressByBloc = new Map((bp ?? []).map((p) => [p.bloc_id, p]));
  const completedVideoIds = new Set((vp ?? []).map((v) => v.video_id));

  return blocs.map((b, index) => {
    const base = mapBloc(b);
    const prog = progressByBloc.get(b.id);
    const examPassed = prog?.exam_passed ?? false;
    const blocVideoIds = videoItems(b).map((i) => i.videos?.id).filter((x): x is string => Boolean(x));
    const videosWatched = blocVideoIds.filter((id) => completedVideoIds.has(id)).length;

    let status: ModuleWithProgress["status"] = "locked";
    const prevPassed = index === 0 || progressByBloc.get(blocs[index - 1].id)?.exam_passed === true;
    if (examPassed) status = "completed";
    else if (index === 0 || prevPassed || prog?.status === "in_progress") status = "in_progress";

    return { ...base, status, videosWatched, examPassed };
  });
}
