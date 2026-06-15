// Service examens modulaires — cable Supabase (schema nested) avec adaptateur vers
// le DTO ModularExam / ExamQuestion / LegacyExamAttempt (pages inchangees).
// Un "examen de module" cote DTO == une ligne exams_bloc (bloc_id UNIQUE). Son
// moduleId == exams_bloc.bloc_id (== l'id du module plat). Ses questions sont les
// rows questions de scope "examen_bloc" rattachees a exam_bloc_id.
// SECRET (RLS) : un eleve ne peut PAS lire correctAnswer/explanation. Cote eleve on
// laisse donc correctAnswer = "" et explanation undefined ; la correction se fait
// exclusivement cote serveur via le RPC submit_exam_attempt.
import { createClient } from "@/lib/supabase/client";
import type { ModularExam, LegacyExamAttempt, ExamQuestion, ExamType } from "@/types";
import type { Database } from "@/types/database.types";

type QuestionRow = {
  id: string;
  content: string;
  is_qcm: boolean;
  options: Database["public"]["Tables"]["questions"]["Row"]["options"];
  points: number;
  position: number;
};

type ExamBlocRow = {
  id: string;
  bloc_id: string;
  title: string;
  passing_score: number;
  time_limit_minutes: number | null;
  created_at: string;
  questions: QuestionRow[];
};

// On embarque les questions de scope "examen_bloc" (les seules rattachees a un
// exam_bloc). content/options sont lisibles ; correctAnswer reste SECRET.
const EXAM_SELECT =
  "id, bloc_id, title, passing_score, time_limit_minutes, created_at, questions(id, content, is_qcm, options, points, position)";

// Sentinelle utilisee par la page examen-final pour recuperer les tentatives de
// type "final" sans connaitre l'id exact de l'exams_final.
const FINAL_SENTINEL = "final-exam";

/** options Json (string[]) -> string[] type-safe. */
function parseOptions(options: QuestionRow["options"]): string[] | undefined {
  if (!Array.isArray(options)) return undefined;
  const list = options.filter((o): o is string => typeof o === "string");
  return list.length > 0 ? list : undefined;
}

// Le DTO distingue qcm / vrai_faux / texte ; la base ne porte que is_qcm + options.
// Convention de cablage : qcm => is_qcm true (+ options) ; vrai_faux => is_qcm false
// avec options ["vrai","faux"] ; texte => is_qcm false sans options.
function mapQuestionType(r: QuestionRow): ExamQuestion["type"] {
  if (r.is_qcm) return "qcm";
  const opts = parseOptions(r.options);
  if (opts && opts.length === 2 && opts.includes("vrai") && opts.includes("faux")) {
    return "vrai_faux";
  }
  return "texte";
}

function mapQuestion(r: QuestionRow): ExamQuestion {
  const type = mapQuestionType(r);
  return {
    id: r.id,
    type,
    question: r.content,
    options: type === "qcm" ? parseOptions(r.options) : undefined,
    // SECRET RLS : la bonne reponse n'est jamais exposee a l'eleve.
    correctAnswer: "",
    points: r.points,
  };
}

function mapExam(e: ExamBlocRow): ModularExam {
  const questions = [...(e.questions ?? [])]
    .sort((a, b) => a.position - b.position)
    .map(mapQuestion);
  return {
    id: e.id,
    moduleId: e.bloc_id,
    title: e.title,
    questions,
    passingScore: e.passing_score,
    // maxAttempts n'a pas de source en base (regles de tentatives portees par
    // submit_exam_attempt cote serveur) : valeur par defaut historique.
    maxAttempts: 3,
    timeLimitMinutes: e.time_limit_minutes,
    createdAt: e.created_at,
  };
}

/**
 * Recupere un examen modulaire par son identifiant (exams_bloc.id).
 *
 * @param id - Identifiant de l'examen
 * @returns L'examen ou null si non trouve
 */
export async function getExam(id: string): Promise<ModularExam | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("exams_bloc")
    .select(EXAM_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? mapExam(data as unknown as ExamBlocRow) : null;
}

/**
 * Recupere l'examen associe a un module (bloc).
 *
 * @param moduleId - Identifiant du module (== bloc_id)
 * @returns L'examen du module ou null
 */
export async function getExamByModule(moduleId: string): Promise<ModularExam | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("exams_bloc")
    .select(EXAM_SELECT)
    .eq("bloc_id", moduleId)
    .maybeSingle();
  if (error) throw error;
  return data ? mapExam(data as unknown as ExamBlocRow) : null;
}

/**
 * Cree un examen modulaire vide pour un module (bloc).
 *
 * @param data - Donnees de l'examen (sans id, questions ni createdAt)
 * @returns L'examen cree
 */
export async function createExam(
  data: Omit<ModularExam, "id" | "createdAt" | "questions">
): Promise<ModularExam> {
  const supabase = createClient();
  const insert: Database["public"]["Tables"]["exams_bloc"]["Insert"] = {
    bloc_id: data.moduleId,
    title: data.title,
    passing_score: data.passingScore,
    time_limit_minutes: data.timeLimitMinutes,
    // Messages d'accueil/attente/reussite NOT NULL en base : valeurs par defaut
    // sobres, editables ensuite cote admin.
    message_accueil: "Bienvenue dans cet examen.",
    message_attente: "Votre tentative est en cours d'analyse.",
    message_reussite: "Félicitations, examen validé.",
  };
  const { data: row, error } = await supabase
    .from("exams_bloc")
    .insert(insert)
    .select(EXAM_SELECT)
    .single();
  if (error) throw error;
  return mapExam(row as unknown as ExamBlocRow);
}

/**
 * Compte les validations de modules sur la plateforme
 * (blocs valides par les apprenants, via bloc_progress.exam_passed).
 *
 * @returns Nombre de modules valides
 */
export async function getPassedModuleExamCount(): Promise<number> {
  const supabase = createClient();
  const { count, error } = await supabase
    .from("bloc_progress")
    .select("id", { count: "exact", head: true })
    .eq("exam_passed", true);
  if (error) throw error;
  return count ?? 0;
}

/**
 * Met a jour un examen modulaire.
 *
 * @param id - Identifiant de l'examen
 * @param data - Champs a modifier
 * @returns L'examen mis a jour
 * @throws Si l'examen n'existe pas
 */
export async function updateExam(id: string, data: Partial<ModularExam>): Promise<ModularExam> {
  const supabase = createClient();
  const patch: Database["public"]["Tables"]["exams_bloc"]["Update"] = {};
  if (data.title !== undefined) patch.title = data.title;
  if (data.passingScore !== undefined) patch.passing_score = data.passingScore;
  if (data.timeLimitMinutes !== undefined) patch.time_limit_minutes = data.timeLimitMinutes;
  const { data: row, error } = await supabase
    .from("exams_bloc")
    .update(patch)
    .eq("id", id)
    .select(EXAM_SELECT)
    .single();
  if (error) throw error;
  return mapExam(row as unknown as ExamBlocRow);
}

/**
 * Ajoute une question a un examen modulaire (scope "examen_bloc").
 *
 * @param examId - Identifiant de l'examen (exams_bloc.id)
 * @param data - Donnees de la question (sans id)
 * @returns La question creee
 * @throws Si l'examen n'existe pas
 */
export async function addExamQuestion(
  examId: string,
  data: Omit<ExamQuestion, "id">
): Promise<ExamQuestion> {
  const supabase = createClient();
  // Position = nombre de questions existantes (append en fin de liste).
  const { count } = await supabase
    .from("questions")
    .select("id", { count: "exact", head: true })
    .eq("exam_bloc_id", examId);

  const isQcm = data.type === "qcm";
  // Convention de cablage du type DTO (cf mapQuestionType).
  const options: string[] | null = isQcm
    ? data.options ?? []
    : data.type === "vrai_faux"
      ? ["vrai", "faux"]
      : null;

  const insert: Database["public"]["Tables"]["questions"]["Insert"] = {
    exam_bloc_id: examId,
    scope: "examen_bloc",
    // L'enum question_type (philosophique/anticipative/validation/integration)
    // n'a pas d'equivalent dans le DTO historique : on retient "validation"
    // (question d'evaluation) pour toutes les questions d'examen.
    type: "validation",
    content: data.question,
    is_qcm: isQcm,
    options,
    points: data.points,
    position: count ?? 0,
  };
  const { data: row, error } = await supabase
    .from("questions")
    .insert(insert)
    .select("id, content, is_qcm, options, points, position")
    .single();
  if (error) throw error;
  return mapQuestion(row as QuestionRow);
}

/**
 * Supprime une question d'un examen modulaire.
 *
 * @param examId - Identifiant de l'examen (exams_bloc.id)
 * @param questionId - Identifiant de la question
 */
export async function deleteExamQuestion(examId: string, questionId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("questions")
    .delete()
    .eq("id", questionId)
    .eq("exam_bloc_id", examId);
  if (error) throw error;
}

/**
 * Mappe une ligne exam_attempts vers le DTO LegacyExamAttempt.
 * Cote eleve, answers n'est pas relu (les reponses correctes restent secretes) :
 * on conserve la structure mais sans valeur exploitable hors de la tentative courante.
 */
function mapAttempt(r: {
  id: string;
  exam_bloc_id: string | null;
  exam_final_id: string | null;
  learner_id: string;
  answers: Database["public"]["Tables"]["exam_attempts"]["Row"]["answers"];
  score: number;
  passed: boolean;
  completed_at: string;
}): LegacyExamAttempt {
  const answers =
    r.answers && typeof r.answers === "object" && !Array.isArray(r.answers)
      ? (r.answers as Record<string, string>)
      : {};
  return {
    id: r.id,
    examId: r.exam_bloc_id ?? r.exam_final_id ?? "",
    learnerId: r.learner_id,
    answers,
    score: r.score,
    passed: r.passed,
    completedAt: r.completed_at,
  };
}

/**
 * Recupere les tentatives d'examen, filtrees par apprenant si precise.
 * examId == "final-exam" cible les tentatives de l'examen final ; sinon, l'examen
 * de module (exams_bloc) correspondant.
 *
 * @param examId - Identifiant de l'examen (ou la sentinelle "final-exam")
 * @param learnerId - Identifiant de l'apprenant (optionnel)
 * @returns Tentatives correspondantes (tri chronologique)
 */
export async function getAttempts(examId: string, learnerId?: string): Promise<LegacyExamAttempt[]> {
  const supabase = createClient();
  let query = supabase
    .from("exam_attempts")
    .select("id, exam_bloc_id, exam_final_id, learner_id, answers, score, passed, completed_at")
    .order("completed_at", { ascending: true });

  if (examId === FINAL_SENTINEL) {
    query = query.eq("exam_kind", "final");
  } else {
    query = query.eq("exam_bloc_id", examId);
  }
  if (learnerId) query = query.eq("learner_id", learnerId);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(mapAttempt);
}

type SubmitExamResult = {
  passed?: boolean;
  score?: number;
  blocked_until?: string | null;
  next_allowed_at?: string | null;
};

/**
 * Soumet une tentative d'examen via le RPC SECURITY DEFINER submit_exam_attempt :
 * la correction et les regles de tentatives (2 essais immediats puis 1/h, max 5/24h
 * pour un module ; J1/J3/J5 pour le final) sont appliquees cote serveur.
 *
 * @param examId - Identifiant de l'examen (exams_bloc.id ou exams_final.id)
 * @param learnerId - Identifiant de l'apprenant (RLS : doit etre l'utilisateur courant)
 * @param answers - Reponses de l'apprenant (questionId -> reponse)
 * @param examType - Type d'examen ("module" => bloc, "final")
 * @returns La tentative enregistree avec score et statut
 * @throws Si la tentative n'est pas autorisee (erreur remontee par le RPC)
 */
export async function submitAttempt(
  examId: string,
  learnerId: string,
  answers: Record<string, string>,
  examType: ExamType = "module"
): Promise<LegacyExamAttempt> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("submit_exam_attempt", {
    p_exam_kind: examType === "final" ? "final" : "bloc",
    p_exam_id: examId,
    p_answers: answers,
  });
  if (error) throw error;
  const result = (data ?? {}) as SubmitExamResult;

  // Le RPC retourne {passed, score, blocked_until, next_allowed_at} ; on reconstruit
  // le DTO de tentative attendu par l'UI (les reponses soumises restent locales).
  return {
    id: `attempt-${Date.now()}`,
    examId,
    learnerId,
    answers,
    score: result.score ?? 0,
    passed: result.passed ?? false,
    completedAt: new Date().toISOString(),
  };
}

// Les examens finaux (demande, planification, notation) vivent dans
// services/final-exams.ts
