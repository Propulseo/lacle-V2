// Service engagement (anti-decrochage, Qualiopi Ind.12) — cable Supabase.
// Lecture STAFF : la vue engagement_overview (jointure profiles + engagement_tracking)
// fournit l'identite de l'apprenant, son statut d'engagement et les compteurs de jours.
// Les relances sont lues depuis engagement_reminders. DTO EngagementLearner inchange.
// NB : currentModule/currentCourse/totalCourses/isReprise ne sont PAS portes par la vue
//   -> valeurs par defaut raisonnables (cf. note en bas de fichier).
import { createClient } from "@/lib/supabase/client";
import type {
  EngagementLearner,
  EngagementStatus,
  ReminderLog,
} from "@/types";

type OverviewRow = {
  learner_id: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  last_connection_at: string | null;
  last_progress_at: string | null;
  days_since_last_activity: number | null;
  status: EngagementStatus | null;
};

type ReminderRow = {
  learner_id: string;
  level: number;
  channel: ReminderLog["type"];
  sent_at: string;
};

const OVERVIEW_SELECT =
  "learner_id, first_name, last_name, email, last_connection_at, last_progress_at, days_since_last_activity, status";

/** Clamp le niveau de relance (DB: number) vers l'union 1|2|3|4 du DTO. */
function clampLevel(level: number): ReminderLog["level"] {
  const n = Math.min(4, Math.max(1, Math.round(level)));
  return n as ReminderLog["level"];
}

function mapReminder(r: ReminderRow): ReminderLog {
  return { level: clampLevel(r.level), type: r.channel, sentAt: new Date(r.sent_at) };
}

function mapLearner(row: OverviewRow, reminders: ReminderLog[]): EngagementLearner {
  return {
    id: row.learner_id ?? "",
    firstName: row.first_name ?? "",
    lastName: row.last_name ?? "",
    email: row.email ?? "",
    engagement: {
      lastConnectionAt: new Date(row.last_connection_at ?? row.last_progress_at ?? Date.now()),
      lastProgressAt: new Date(row.last_progress_at ?? Date.now()),
      daysSinceLastActivity: row.days_since_last_activity ?? 0,
      remindersSent: reminders,
      status: row.status ?? "actif",
    },
    // Champs sans source dans engagement_overview — defauts neutres (cf. note bas de fichier).
    currentModule: 0,
    currentCourse: 0,
    totalCourses: 0,
    isReprise: false,
  };
}

/**
 * Recupere les apprenants avec leurs donnees d'engagement (anti-decrochage).
 * Inclut le statut d'engagement, les dates de derniere activite et les relances.
 *
 * @returns Apprenants avec tracking d'engagement
 */
// TODO // Qualiopi Ind.12 : suivi de l'engagement et prevention du decrochage (vue staff)
export async function getEngagementLearners(): Promise<EngagementLearner[]> {
  const supabase = createClient();

  const [{ data: rows, error }, { data: reminderRows, error: remErr }] = await Promise.all([
    supabase
      .from("engagement_overview")
      .select(OVERVIEW_SELECT)
      .order("days_since_last_activity", { ascending: false }),
    supabase
      .from("engagement_reminders")
      .select("learner_id, level, channel, sent_at")
      .order("sent_at", { ascending: true }),
  ]);
  if (error) throw error;
  if (remErr) throw remErr;

  const remindersByLearner = new Map<string, ReminderLog[]>();
  for (const r of (reminderRows as ReminderRow[]) ?? []) {
    const list = remindersByLearner.get(r.learner_id) ?? [];
    list.push(mapReminder(r));
    remindersByLearner.set(r.learner_id, list);
  }

  return ((rows as OverviewRow[]) ?? []).map((row) =>
    mapLearner(row, remindersByLearner.get(row.learner_id ?? "") ?? []),
  );
}

/**
 * Compte les apprenants en situation d'abandon (inactifs depuis 42 jours).
 *
 * @param list - Liste des apprenants avec engagement
 * @returns Nombre d'apprenants en abandon
 */
export function getAbandonCount(list: EngagementLearner[]): number {
  return list.filter((l) => l.engagement.status === "inactif_42j").length;
}
