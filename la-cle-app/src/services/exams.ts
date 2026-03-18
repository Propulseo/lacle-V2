import { mockExams, mockExamAttempts } from "@/data/mock/exams";
import type { ModularExam, ExamAttempt, ExamQuestion, FinalExam } from "@/types";
import { sleep, generateId } from "@/lib/utils";

const exams = [...mockExams];
const attempts = [...mockExamAttempts];

export async function getExam(id: string): Promise<ModularExam | null> {
  await sleep(200);
  return exams.find((e) => e.id === id) || null;
}

export async function getExamByModule(moduleId: string): Promise<ModularExam | null> {
  await sleep(200);
  return exams.find((e) => e.moduleId === moduleId) || null;
}

export async function updateExam(id: string, data: Partial<ModularExam>): Promise<ModularExam> {
  await sleep(300);
  const idx = exams.findIndex((e) => e.id === id);
  if (idx === -1) throw new Error("Examen non trouvé");
  exams[idx] = { ...exams[idx], ...data };
  return exams[idx];
}

export async function addExamQuestion(examId: string, data: Omit<ExamQuestion, "id">): Promise<ExamQuestion> {
  await sleep(300);
  const exam = exams.find((e) => e.id === examId);
  if (!exam) throw new Error("Examen non trouvé");
  const question: ExamQuestion = { ...data, id: `eq-${generateId()}` };
  exam.questions.push(question);
  return question;
}

export async function deleteExamQuestion(examId: string, questionId: string): Promise<void> {
  await sleep(200);
  const exam = exams.find((e) => e.id === examId);
  if (!exam) throw new Error("Examen non trouvé");
  exam.questions = exam.questions.filter((q) => q.id !== questionId);
}

export async function getAttempts(examId: string, learnerId?: string): Promise<ExamAttempt[]> {
  await sleep(200);
  return attempts.filter(
    (a) => a.examId === examId && (!learnerId || a.learnerId === learnerId)
  );
}

export async function submitAttempt(
  examId: string,
  learnerId: string,
  answers: Record<string, string>
): Promise<ExamAttempt> {
  await sleep(500);
  const exam = exams.find((e) => e.id === examId);
  if (!exam) throw new Error("Examen non trouvé");

  let correctCount = 0;
  for (const q of exam.questions) {
    if (answers[q.id]?.toLowerCase() === q.correctAnswer.toLowerCase()) {
      correctCount++;
    }
  }
  const score = Math.round((correctCount / exam.questions.length) * 100);
  const passed = score >= exam.passingScore;

  const attempt: ExamAttempt = {
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

export async function getFinalExams(): Promise<FinalExam[]> {
  await sleep(200);
  return [...finalExams];
}

export async function getFinalExam(learnerId: string): Promise<FinalExam | null> {
  await sleep(200);
  return finalExams.find((e) => e.learnerId === learnerId) || null;
}

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

export async function updateFinalExam(id: string, data: Partial<FinalExam>): Promise<FinalExam> {
  await sleep(300);
  const idx = finalExams.findIndex((e) => e.id === id);
  if (idx === -1) throw new Error("Examen final non trouvé");
  finalExams[idx] = { ...finalExams[idx], ...data };
  return finalExams[idx];
}
