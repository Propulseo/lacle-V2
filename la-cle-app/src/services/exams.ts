import { mockExams, mockExamAttempts } from "@/data/mock/exams";
import type { ModularExam, LegacyExamAttempt, ExamQuestion, FinalExam, ExamType } from "@/types";
import { sleep, generateId } from "@/lib/utils";
import { computeExamStatus } from "@/lib/exam-logic";

const exams = [...mockExams];
const attempts = [...mockExamAttempts];

/**
 * Recupere un examen modulaire par son identifiant.
 *
 * @param id - Identifiant de l'examen
 * @returns L'examen ou null si non trouve
 */
export async function getExam(id: string): Promise<ModularExam | null> {
  await sleep(200);
  return exams.find((e) => e.id === id) || null;
}

/**
 * Recupere l'examen associe a un module.
 *
 * @param moduleId - Identifiant du module
 * @returns L'examen du module ou null
 */
export async function getExamByModule(moduleId: string): Promise<ModularExam | null> {
  await sleep(200);
  return exams.find((e) => e.moduleId === moduleId) || null;
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
  await sleep(300);
  const idx = exams.findIndex((e) => e.id === id);
  if (idx === -1) throw new Error("Examen non trouvé");
  exams[idx] = { ...exams[idx], ...data };
  return exams[idx];
}

/**
 * Ajoute une question a un examen modulaire.
 *
 * @param examId - Identifiant de l'examen
 * @param data - Donnees de la question (sans id)
 * @returns La question creee
 * @throws Si l'examen n'existe pas
 */
export async function addExamQuestion(examId: string, data: Omit<ExamQuestion, "id">): Promise<ExamQuestion> {
  await sleep(300);
  const exam = exams.find((e) => e.id === examId);
  if (!exam) throw new Error("Examen non trouvé");
  const question: ExamQuestion = { ...data, id: `eq-${generateId()}` };
  exam.questions.push(question);
  return question;
}

/**
 * Supprime une question d'un examen modulaire.
 *
 * @param examId - Identifiant de l'examen
 * @param questionId - Identifiant de la question
 * @throws Si l'examen n'existe pas
 */
export async function deleteExamQuestion(examId: string, questionId: string): Promise<void> {
  await sleep(200);
  const exam = exams.find((e) => e.id === examId);
  if (!exam) throw new Error("Examen non trouvé");
  exam.questions = exam.questions.filter((q) => q.id !== questionId);
}

/**
 * Recupere les tentatives d'examen, filtrees par apprenant si precise.
 *
 * @param examId - Identifiant de l'examen
 * @param learnerId - Identifiant de l'apprenant (optionnel)
 * @returns Tentatives correspondantes
 */
export async function getAttempts(examId: string, learnerId?: string): Promise<LegacyExamAttempt[]> {
  await sleep(200);
  return attempts.filter(
    (a) => a.examId === examId && (!learnerId || a.learnerId === learnerId)
  );
}

/**
 * Soumet une tentative d'examen, calcule le score et verifie les regles de tentatives.
 * Respecte les limites : 2 essais immediats, puis 1/heure, max 5/24h (module)
 * ou J1/J3/J5 avec blocages (final).
 *
 * @param examId - Identifiant de l'examen
 * @param learnerId - Identifiant de l'apprenant
 * @param answers - Reponses de l'apprenant (questionId -> reponse)
 * @param examType - Type d'examen ("module" ou "final")
 * @returns La tentative enregistree avec score et statut
 * @throws Si la tentative n'est pas autorisee ou si l'examen n'existe pas
 */
export async function submitAttempt(
  examId: string,
  learnerId: string,
  answers: Record<string, string>,
  examType: ExamType = "module"
): Promise<LegacyExamAttempt> {
  await sleep(500);
  const exam = exams.find((e) => e.id === examId);
  if (!exam) throw new Error("Examen non trouvé");

  // Validate attempt is allowed
  const pastAttempts = attempts.filter(
    (a) => a.examId === examId && a.learnerId === learnerId
  );
  const status = computeExamStatus(pastAttempts, examType);
  if (!status.canAttempt) {
    throw new Error("Tentative non autorisée");
  }
  // TODO // Supabase: vérification côté serveur via RPC avant insert

  let correctCount = 0;
  for (const q of exam.questions) {
    if (answers[q.id]?.toLowerCase() === q.correctAnswer.toLowerCase()) {
      correctCount++;
    }
  }
  const score = Math.round((correctCount / exam.questions.length) * 100);
  const passed = score >= exam.passingScore;

  const attempt: LegacyExamAttempt = {
    id: `attempt-${generateId()}`,
    examId,
    learnerId,
    answers,
    score,
    passed,
    completedAt: new Date().toISOString(),
  };
  attempts.push(attempt);
  return attempt;
}

// Final exam mock
const finalExams: FinalExam[] = [
  {
    id: "final-2",
    learnerId: "learner-2",
    status: "requested",
    requestedAt: "2026-03-10T10:00:00Z",
    scheduledAt: null,
    completedAt: null,
    score: null,
    notes: null,
  },
  {
    id: "final-3",
    learnerId: "learner-3",
    status: "passed",
    requestedAt: "2026-01-15T10:00:00Z",
    scheduledAt: "2026-02-01T09:00:00Z",
    completedAt: "2026-02-01T11:00:00Z",
    score: 95,
    notes: "Excellente maîtrise des protocoles.",
  },
];

/**
 * Recupere tous les examens finaux (vue admin).
 *
 * @returns Liste de tous les examens finaux
 */
export async function getFinalExams(): Promise<FinalExam[]> {
  await sleep(200);
  return [...finalExams];
}

/**
 * Recupere l'examen final d'un apprenant.
 *
 * @param learnerId - Identifiant de l'apprenant
 * @returns L'examen final ou null si aucune demande
 */
export async function getFinalExam(learnerId: string): Promise<FinalExam | null> {
  await sleep(200);
  return finalExams.find((e) => e.learnerId === learnerId) || null;
}

/**
 * Envoie une demande d'examen final pour un apprenant.
 *
 * @param learnerId - Identifiant de l'apprenant
 * @returns L'examen final cree avec statut "requested"
 * @throws Si une demande existe deja
 */
export async function requestFinalExam(learnerId: string): Promise<FinalExam> {
  await sleep(400);
  const existing = finalExams.find((e) => e.learnerId === learnerId);
  if (existing) throw new Error("Demande déjà existante");
  const exam: FinalExam = {
    id: `final-${generateId()}`,
    learnerId,
    status: "requested",
    requestedAt: new Date().toISOString(),
    scheduledAt: null,
    completedAt: null,
    score: null,
    notes: null,
  };
  finalExams.push(exam);
  return exam;
}

/**
 * Met a jour un examen final (planification, notation, etc.).
 *
 * @param id - Identifiant de l'examen final
 * @param data - Champs a modifier
 * @returns L'examen final mis a jour
 * @throws Si l'examen final n'existe pas
 */
export async function updateFinalExam(id: string, data: Partial<FinalExam>): Promise<FinalExam> {
  await sleep(300);
  const idx = finalExams.findIndex((e) => e.id === id);
  if (idx === -1) throw new Error("Examen final non trouvé");
  finalExams[idx] = { ...finalExams[idx], ...data };
  return finalExams[idx];
}
