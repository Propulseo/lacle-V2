// Service learners — cable Supabase (espace admin/staff) avec adaptateur vers le
// DTO Learner (pages inchangees). Un "apprenant" == profile(role='eleve') + son
// enrollment dans la formation active + agregats de progression.
//
// Sources progression :
//   - bloc_progress (exam_passed) -> modules/exams completes
//   - video_progress (completed)  -> videos vues
//   - final_exam_progress.status  -> statut examen final
//   - totaux (modules/videos/exams) : structure de la formation (blocs/cours/items)
//
// NB PostgREST : embeds 1-a-1 (FK UNIQUE) -> OBJET, 1-a-N -> TABLEAU.
//   videos (item_id UNIQUE) est un objet ; cours/course_items sont des tableaux.
// SECURITE (RLS) : lecture reservee au staff (policies is_staff). La creation
//   d'apprenant passe par une Server Action service_role (voir createLearner).
import { createClient } from "@/lib/supabase/client";
import { getActiveFormationId } from "@/lib/supabase/formation";
import type {
  Learner,
  LearnerFormData,
  LearnerProgression,
  StudentStatus,
} from "@/types";
import type { FinalExamStatus } from "@/types/exam";
import type { Database } from "@/types/database.types";
import type { SupabaseClient } from "@supabase/supabase-js";

type Supabase = SupabaseClient<Database>;

type ProfileRow = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  is_active: boolean;
  must_change_password: boolean;
  created_at: string;
  last_login_at: string | null;
};

const PROFILE_SELECT =
  "id, first_name, last_name, email, phone, is_active, must_change_password, created_at, last_login_at";

/** Totaux de structure de la formation (denominateurs de progression). */
type FormationTotals = { modulesTotal: number; videosTotal: number };

/** Compteurs agreges par eleve, calcules a partir des tables de progression. */
type ProgressCounts = {
  modulesCompleted: number;
  videosWatched: number;
  finalExamStatus: FinalExamStatus;
};

/** Progression "vide" (eleve sans aucun avancement). */
function emptyProgression(totals: FormationTotals): LearnerProgression {
  return {
    overallPercent: 0,
    modulesCompleted: 0,
    modulesTotal: totals.modulesTotal,
    videosWatched: 0,
    videosTotal: totals.videosTotal,
    examsPassed: 0,
    examsTotal: totals.modulesTotal,
    finalExamStatus: "not_started",
  };
}

/** Assemble la progression DTO a partir des totaux et des compteurs eleve. */
function buildProgression(
  totals: FormationTotals,
  counts: ProgressCounts,
): LearnerProgression {
  const overallPercent =
    totals.modulesTotal > 0
      ? Math.round((counts.modulesCompleted / totals.modulesTotal) * 100)
      : 0;
  return {
    overallPercent,
    modulesCompleted: counts.modulesCompleted,
    modulesTotal: totals.modulesTotal,
    videosWatched: counts.videosWatched,
    videosTotal: totals.videosTotal,
    // Reussir l'examen d'un module == valider le module (meme compteur).
    examsPassed: counts.modulesCompleted,
    examsTotal: totals.modulesTotal,
    finalExamStatus: counts.finalExamStatus,
  };
}

/** Mappe profile + enrollment + progression vers le DTO Learner. */
function mapLearner(
  p: ProfileRow,
  status: StudentStatus,
  progression: LearnerProgression,
): Learner {
  return {
    id: p.id,
    firstName: p.first_name,
    lastName: p.last_name,
    email: p.email,
    phone: p.phone ?? "",
    status,
    createdAt: p.created_at,
    lastLoginAt: p.last_login_at,
    isActive: p.is_active,
    mustChangePassword: p.must_change_password,
    progression,
  };
}

/**
 * Compte les modules (blocs publies) et les videos de la formation active.
 * Sert de denominateur a la progression de chaque eleve.
 */
async function getFormationTotals(
  supabase: Supabase,
  formationId: string,
): Promise<FormationTotals> {
  const { data, error } = await supabase
    .from("blocs")
    .select("id, cours(course_items(kind))")
    .eq("formation_id", formationId)
    .eq("is_published", true);
  if (error) throw error;
  const blocs =
    (data as unknown as { id: string; cours: { course_items: { kind: string }[] }[] }[]) ?? [];
  const videosTotal = blocs.reduce(
    (sum, b) =>
      sum +
      (b.cours ?? [])
        .flatMap((c) => c.course_items ?? [])
        .filter((i) => i.kind === "video").length,
    0,
  );
  return { modulesTotal: blocs.length, videosTotal };
}

/**
 * Calcule les compteurs de progression pour un ensemble d'eleves en un nombre
 * fixe de requetes (evite le N+1). Retourne une Map indexee par learnerId.
 */
async function getProgressCountsByLearner(
  supabase: Supabase,
  learnerIds: string[],
): Promise<Map<string, ProgressCounts>> {
  const result = new Map<string, ProgressCounts>();
  if (learnerIds.length === 0) return result;

  const [{ data: bp, error: bpErr }, { data: vp, error: vpErr }, { data: fp, error: fpErr }] =
    await Promise.all([
      supabase
        .from("bloc_progress")
        .select("learner_id, exam_passed")
        .in("learner_id", learnerIds)
        .eq("exam_passed", true),
      supabase
        .from("video_progress")
        .select("learner_id, completed")
        .in("learner_id", learnerIds)
        .eq("completed", true),
      supabase
        .from("final_exam_progress")
        .select("learner_id, status")
        .in("learner_id", learnerIds),
    ]);
  if (bpErr) throw bpErr;
  if (vpErr) throw vpErr;
  if (fpErr) throw fpErr;

  for (const id of learnerIds) {
    result.set(id, { modulesCompleted: 0, videosWatched: 0, finalExamStatus: "not_started" });
  }
  for (const row of bp ?? []) {
    const c = result.get(row.learner_id);
    if (c) c.modulesCompleted += 1;
  }
  for (const row of vp ?? []) {
    const c = result.get(row.learner_id);
    if (c) c.videosWatched += 1;
  }
  for (const row of fp ?? []) {
    const c = result.get(row.learner_id);
    if (!c) continue;
    // L'enum DB inclut des etats "cas pratique" hors DTO historique : on les
    // ramene au statut le plus proche (cf. final-exams.ts mapStatus).
    const s = row.status;
    c.finalExamStatus =
      s === "practical_case_open" ? "scheduled"
      : s === "practical_case_passed" ? "passed"
      : s === "practical_case_failed" ? "failed"
      : s;
  }
  return result;
}

/**
 * Recupere la liste de tous les apprenants (eleves inscrits a la formation
 * active) avec leur progression agregee. Lecture staff.
 *
 * @returns Tableau de tous les apprenants
 */
export async function getLearners(): Promise<Learner[]> {
  const supabase = createClient();
  const formationId = await getActiveFormationId(supabase);
  if (!formationId) return [];

  const { data: enrollments, error } = await supabase
    .from("enrollments")
    .select(`status, learner_id, profiles!enrollments_learner_id_fkey(${PROFILE_SELECT})`)
    .eq("formation_id", formationId);
  if (error) throw error;

  type EnrollmentRow = { status: StudentStatus; learner_id: string; profiles: ProfileRow | null };
  const rows = ((enrollments as unknown as EnrollmentRow[]) ?? []).filter((r) => r.profiles);
  if (rows.length === 0) return [];

  const learnerIds = rows.map((r) => r.learner_id);
  const [totals, counts] = await Promise.all([
    getFormationTotals(supabase, formationId),
    getProgressCountsByLearner(supabase, learnerIds),
  ]);

  return rows.map((r) => {
    const c = counts.get(r.learner_id);
    const progression = c ? buildProgression(totals, c) : emptyProgression(totals);
    return mapLearner(r.profiles as ProfileRow, r.status, progression);
  });
}

/**
 * Recupere un apprenant par son identifiant (avec sa progression detaillee).
 * Lecture staff.
 *
 * @param id - Identifiant de l'apprenant
 * @returns L'apprenant ou null si non trouve
 */
export async function getLearner(id: string): Promise<Learner | null> {
  const supabase = createClient();
  const formationId = await getActiveFormationId(supabase);
  if (!formationId) return null;

  const { data: profile, error: pErr } = await supabase
    .from("profiles")
    .select(PROFILE_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (pErr) throw pErr;
  if (!profile) return null;

  const { data: enrollment, error: eErr } = await supabase
    .from("enrollments")
    .select("status")
    .eq("formation_id", formationId)
    .eq("learner_id", id)
    .maybeSingle();
  if (eErr) throw eErr;

  const [totals, counts] = await Promise.all([
    getFormationTotals(supabase, formationId),
    getProgressCountsByLearner(supabase, [id]),
  ]);
  const c = counts.get(id);
  const progression = c ? buildProgression(totals, c) : emptyProgression(totals);
  const status: StudentStatus = enrollment?.status ?? "decouverte";
  return mapLearner(profile as ProfileRow, status, progression);
}

/**
 * Cree un nouvel apprenant. La creation d'un compte (auth + profile + envoi du
 * mot de passe temporaire) requiert la cle service_role et doit donc passer par
 * une Server Action dediee — elle ne peut pas s'executer cote client (RLS).
 *
 * @throws Toujours — rediriger vers la Server Action createLearner.
 */
export async function createLearner(_data: LearnerFormData): Promise<Learner> {
  // TODO // Supabase: Server Action service_role -> auth.admin.createUser +
  //   insert profiles(role='eleve') + insert enrollments(formation active, statut 'inscrit').
  // TODO // Resend: email de bienvenue + mot de passe temporaire (must_change_password).
  void _data;
  throw new Error("Utiliser la Server Action createLearner");
}

/**
 * Met a jour les informations de profil d'un apprenant existant. Lecture/ecriture staff.
 *
 * @param id - Identifiant de l'apprenant
 * @param data - Champs a modifier
 * @returns L'apprenant mis a jour
 * @throws Si l'apprenant n'existe pas
 */
export async function updateLearner(id: string, data: Partial<LearnerFormData>): Promise<Learner> {
  const supabase = createClient();
  const patch: Database["public"]["Tables"]["profiles"]["Update"] = {};
  if (data.firstName !== undefined) patch.first_name = data.firstName;
  if (data.lastName !== undefined) patch.last_name = data.lastName;
  if (data.email !== undefined) patch.email = data.email;
  if (data.phone !== undefined) patch.phone = data.phone;

  const { error } = await supabase.from("profiles").update(patch).eq("id", id);
  if (error) throw error;

  const learner = await getLearner(id);
  if (!learner) throw new Error("Apprenant non trouvé");
  return learner;
}

/**
 * Bascule l'etat actif/inactif d'un apprenant (champ profiles.is_active).
 *
 * @param id - Identifiant de l'apprenant
 * @returns L'apprenant avec le flag `isActive` inverse
 * @throws Si l'apprenant n'existe pas
 */
export async function toggleActive(id: string): Promise<Learner> {
  const supabase = createClient();
  const { data: current, error: cErr } = await supabase
    .from("profiles")
    .select("is_active")
    .eq("id", id)
    .maybeSingle();
  if (cErr) throw cErr;
  if (!current) throw new Error("Apprenant non trouvé");

  const { error } = await supabase
    .from("profiles")
    .update({ is_active: !current.is_active })
    .eq("id", id);
  if (error) throw error;

  const learner = await getLearner(id);
  if (!learner) throw new Error("Apprenant non trouvé");
  return learner;
}

/**
 * Change le statut d'un apprenant (decouverte, inscrit, bloque, certifie) sur
 * son enrollment de la formation active.
 *
 * @param id - Identifiant de l'apprenant
 * @param status - Nouveau statut
 * @returns L'apprenant mis a jour
 * @throws Si l'apprenant n'existe pas
 */
export async function updateLearnerStatus(id: string, status: StudentStatus): Promise<Learner> {
  const supabase = createClient();
  const formationId = await getActiveFormationId(supabase);
  if (!formationId) throw new Error("Aucune formation active");

  const { error } = await supabase
    .from("enrollments")
    .update({ status })
    .eq("formation_id", formationId)
    .eq("learner_id", id);
  if (error) throw error;

  const learner = await getLearner(id);
  if (!learner) throw new Error("Apprenant non trouvé");
  return learner;
}

/**
 * Calcule les statistiques globales des apprenants de la formation active
 * (total, actifs, repartition par statut). Lecture staff.
 *
 * @returns Objet avec les compteurs par statut
 */
export async function getLearnerStats() {
  const supabase = createClient();
  const formationId = await getActiveFormationId(supabase);
  const empty = { total: 0, active: 0, decouverte: 0, inscrit: 0, certifie: 0, bloque: 0 };
  if (!formationId) return empty;

  const { data, error } = await supabase
    .from("enrollments")
    .select(`status, profiles!enrollments_learner_id_fkey(is_active)`)
    .eq("formation_id", formationId);
  if (error) throw error;

  type StatRow = { status: StudentStatus; profiles: { is_active: boolean } | null };
  const rows = (data as unknown as StatRow[]) ?? [];
  return rows.reduce((acc, r) => {
    acc.total += 1;
    if (r.profiles?.is_active) acc.active += 1;
    acc[r.status] += 1;
    return acc;
  }, { ...empty });
}
