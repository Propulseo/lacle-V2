// Service videos — cable Supabase (schema nested) avec adaptateur vers le DTO
// plat Video/VideoQuestion (pages inchangees).
// Une "video" plate vit sous course_items(kind=video) > cours > bloc. Le moduleId
// du DTO == bloc.id du cours parent ; l'ordre du DTO == course_items.position.
// Les questions overlay sont embarquees depuis video_overlay_questions.
// NB PostgREST : les embeds 1-a-1 (FK UNIQUE) reviennent en OBJET, les 1-a-N en
//   tableau -> videos.item_id (UNIQUE) et course_items.cours_id donnent des objets,
//   video_overlay_questions un tableau.
// SECRET (RLS) : la bonne reponse et l'explication d'une question overlay vivent
//   dans video_overlay_answers, NON lisible cote eleve. On ne les SELECT jamais ici
//   -> correctAnswer reste "" et explanation undefined (la correction se fait serveur).
import { createClient } from "@/lib/supabase/client";
import type { Video, VideoQuestion } from "@/types";
import type { Database } from "@/types/database.types";
import { generateId } from "@/lib/utils";

type OverlayQuestionRow = {
  id: string;
  video_id: string;
  timestamp_seconds: number;
  format: Database["public"]["Enums"]["question_format"];
  question: string;
  options: Database["public"]["Tables"]["video_overlay_questions"]["Row"]["options"];
};

// course_items.cours_id UNIQUE cote item -> objet ; videos.item_id UNIQUE -> objet.
type CourseItemEmbed = { id: string; position: number; cours: { bloc_id: string } | null } | null;

type VideoRow = {
  id: string;
  title: string;
  description: string | null;
  duration_seconds: number;
  src: string | null;
  thumbnail_url: string | null;
  is_published: boolean;
  created_at: string;
  course_items: CourseItemEmbed;
  video_overlay_questions: OverlayQuestionRow[];
};

const VIDEO_SELECT =
  "id, title, description, duration_seconds, src, thumbnail_url, is_published, created_at, " +
  "course_items!inner(id, position, cours!inner(bloc_id)), " +
  "video_overlay_questions(id, video_id, timestamp_seconds, format, question, options)";

/** Mappe une option JSON (string[] attendu) vers le tableau de chaines du DTO. */
function mapOptions(options: OverlayQuestionRow["options"]): string[] | undefined {
  if (!Array.isArray(options)) return undefined;
  return options.filter((o): o is string => typeof o === "string");
}

/** Mappe une question overlay. correctAnswer/explanation SECRET -> valeurs neutres. */
function mapOverlayQuestion(q: OverlayQuestionRow): VideoQuestion {
  return {
    id: q.id,
    videoId: q.video_id,
    timestamp: q.timestamp_seconds,
    type: q.format,
    question: q.question,
    options: mapOptions(q.options),
    correctAnswer: "", // SECRET (video_overlay_answers, non lisible cote client)
    explanation: undefined, // SECRET
  };
}

function mapVideo(v: VideoRow): Video {
  const questions = (v.video_overlay_questions ?? [])
    .map(mapOverlayQuestion)
    .sort((a, b) => a.timestamp - b.timestamp);
  return {
    id: v.id,
    moduleId: v.course_items?.cours?.bloc_id ?? "",
    title: v.title,
    description: v.description ?? "",
    order: v.course_items?.position ?? 0,
    duration: v.duration_seconds,
    src: v.src,
    thumbnailUrl: v.thumbnail_url,
    questions,
    isPublished: v.is_published,
    createdAt: v.created_at,
  };
}

/**
 * Recupere les videos d'un module (bloc), triees par ordre (course_items.position).
 *
 * @param moduleId - Identifiant du module (bloc)
 * @returns Videos du module triees par `order`
 */
export async function getVideosByModule(moduleId: string): Promise<Video[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("videos")
    .select(VIDEO_SELECT)
    .eq("course_items.cours.bloc_id", moduleId);
  if (error) throw error;
  return (data as unknown as VideoRow[]).map(mapVideo).sort((a, b) => a.order - b.order);
}

/**
 * Recupere une video par son identifiant.
 *
 * @param id - Identifiant de la video
 * @returns La video ou null si non trouvee
 */
export async function getVideo(id: string): Promise<Video | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("videos")
    .select(VIDEO_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? mapVideo(data as unknown as VideoRow) : null;
}

/**
 * Trouve un cours sous le bloc, ou en cree un par defaut si le bloc n'en a aucun.
 * (Une video plate doit etre rattachee a un cours via un course_item.)
 */
async function ensureCoursForBloc(
  supabase: ReturnType<typeof createClient>,
  blocId: string,
): Promise<string> {
  const { data: existing, error: selErr } = await supabase
    .from("cours")
    .select("id")
    .eq("bloc_id", blocId)
    .order("position", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (selErr) throw selErr;
  if (existing) return existing.id;

  const coursInsert: Database["public"]["Tables"]["cours"]["Insert"] = {
    bloc_id: blocId,
    numero: 1,
    position: 1,
  };
  const { data: created, error: insErr } = await supabase
    .from("cours")
    .insert(coursInsert)
    .select("id")
    .single();
  if (insErr) throw insErr;
  return created.id;
}

/**
 * Cree une nouvelle video dans un module (bloc).
 * Cree au passage le course_item (kind=video) qui la porte sous un cours du bloc.
 *
 * @param data - Donnees de la video (sans id, createdAt, questions)
 * @returns La video creee avec son ID genere
 */
export async function createVideo(
  data: Omit<Video, "id" | "createdAt" | "questions">,
): Promise<Video> {
  const supabase = createClient();
  const coursId = await ensureCoursForBloc(supabase, data.moduleId);

  const itemInsert: Database["public"]["Tables"]["course_items"]["Insert"] = {
    cours_id: coursId,
    kind: "video",
    position: data.order,
  };
  const { data: item, error: itemErr } = await supabase
    .from("course_items")
    .insert(itemInsert)
    .select("id")
    .single();
  if (itemErr) throw itemErr;

  const videoInsert: Database["public"]["Tables"]["videos"]["Insert"] = {
    item_id: item.id,
    code: `video-${generateId()}`,
    title: data.title,
    description: data.description,
    duration_seconds: data.duration,
    src: data.src,
    thumbnail_url: data.thumbnailUrl,
    is_published: data.isPublished,
  };
  const { data: row, error: videoErr } = await supabase
    .from("videos")
    .insert(videoInsert)
    .select(VIDEO_SELECT)
    .single();
  if (videoErr) throw videoErr;
  return mapVideo(row as unknown as VideoRow);
}

/**
 * Met a jour une video existante.
 * L'ordre est porte par le course_item (position) : on le met a jour si fourni.
 *
 * @param id - Identifiant de la video
 * @param data - Champs a modifier
 * @returns La video mise a jour
 * @throws Si la video n'existe pas
 */
export async function updateVideo(id: string, data: Partial<Video>): Promise<Video> {
  const supabase = createClient();

  const patch: Database["public"]["Tables"]["videos"]["Update"] = {};
  if (data.title !== undefined) patch.title = data.title;
  if (data.description !== undefined) patch.description = data.description;
  if (data.duration !== undefined) patch.duration_seconds = data.duration;
  if (data.src !== undefined) patch.src = data.src;
  if (data.thumbnailUrl !== undefined) patch.thumbnail_url = data.thumbnailUrl;
  if (data.isPublished !== undefined) patch.is_published = data.isPublished;

  if (Object.keys(patch).length > 0) {
    const { error } = await supabase.from("videos").update(patch).eq("id", id);
    if (error) throw error;
  }

  // L'ordre vit sur le course_item parent.
  if (data.order !== undefined) {
    const { data: v, error: selErr } = await supabase
      .from("videos")
      .select("item_id")
      .eq("id", id)
      .single();
    if (selErr) throw selErr;
    const itemPatch: Database["public"]["Tables"]["course_items"]["Update"] = { position: data.order };
    const { error: itemErr } = await supabase
      .from("course_items")
      .update(itemPatch)
      .eq("id", v.item_id);
    if (itemErr) throw itemErr;
  }

  const updated = await getVideo(id);
  if (!updated) throw new Error("Vidéo non trouvée");
  return updated;
}

/**
 * Supprime une video par son identifiant.
 * On supprime le course_item porteur ; la video et ses questions overlay
 * disparaissent en cascade.
 *
 * @param id - Identifiant de la video
 * @throws Si la video n'existe pas
 */
export async function deleteVideo(id: string): Promise<void> {
  const supabase = createClient();
  const { data: v, error: selErr } = await supabase
    .from("videos")
    .select("item_id")
    .eq("id", id)
    .maybeSingle();
  if (selErr) throw selErr;
  if (!v) throw new Error("Vidéo non trouvée");
  const { error } = await supabase.from("course_items").delete().eq("id", v.item_id);
  if (error) throw error;
}

/**
 * Ajoute une question overlay a une video (declenchee a un timestamp).
 * La bonne reponse/explication (SECRET) doivent etre ecrites cote serveur ;
 * cet adaptateur ne persiste que ce qui est lisible cote client.
 *
 * @param videoId - Identifiant de la video
 * @param data - Donnees de la question (sans id ni videoId)
 * @returns La question creee
 * @throws Si la video n'existe pas
 */
export async function addVideoQuestion(
  videoId: string,
  data: Omit<VideoQuestion, "id" | "videoId">,
): Promise<VideoQuestion> {
  const supabase = createClient();
  const insert: Database["public"]["Tables"]["video_overlay_questions"]["Insert"] = {
    video_id: videoId,
    timestamp_seconds: data.timestamp,
    format: data.type,
    question: data.question,
    options: data.options ?? null,
  };
  const { data: row, error } = await supabase
    .from("video_overlay_questions")
    .insert(insert)
    .select("id, video_id, timestamp_seconds, format, question, options")
    .single();
  if (error) throw error;
  return mapOverlayQuestion(row as unknown as OverlayQuestionRow);
}

/**
 * Supprime une question overlay d'une video.
 *
 * @param videoId - Identifiant de la video
 * @param questionId - Identifiant de la question a supprimer
 * @throws Si la video n'existe pas
 */
export async function deleteVideoQuestion(videoId: string, questionId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("video_overlay_questions")
    .delete()
    .eq("id", questionId)
    .eq("video_id", videoId);
  if (error) throw error;
}

/**
 * Marque une video comme visionnee par un apprenant.
 * Passe par la RPC SECURITY DEFINER record_video_progress (loi metier serveur).
 * Le learnerId est derive du JWT cote serveur : on ne le transmet pas.
 *
 * @param videoId - Identifiant de la video
 * @param _learnerId - Conserve pour compat de signature (ignore : derive du JWT)
 */
export async function markVideoCompleted(videoId: string, _learnerId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.rpc("record_video_progress", {
    p_video_id: videoId,
    p_position: 0,
    p_completed: true,
  });
  if (error) throw error;
}

/**
 * Enregistre la position de lecture (sans completer) — appel periodique facultatif.
 */
export async function recordVideoPosition(videoId: string, positionSeconds: number): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.rpc("record_video_progress", {
    p_video_id: videoId,
    p_position: Math.max(0, Math.floor(positionSeconds)),
    p_completed: false,
  });
  if (error) throw error;
}

/**
 * Ids des videos completees par l'apprenant courant (RLS self sur video_progress).
 * Source de verite pour la progression, les titres masques et le coffre.
 */
export async function getCompletedVideoIds(): Promise<Set<string>> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("video_progress")
    .select("video_id")
    .eq("completed", true);
  if (error) throw error;
  return new Set((data ?? []).map((r) => r.video_id));
}
