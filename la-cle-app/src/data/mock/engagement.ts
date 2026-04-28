import type { ReminderLog, EngagementStatus, EngagementLearner } from "@/types";

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function reminder(level: ReminderLog["level"], daysAgo: number): ReminderLog {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return { level, sentAt: d, type: level === 4 ? "call" : "email" };
}

function make(
  id: string,
  firstName: string,
  lastName: string,
  email: string,
  daysSince: number,
  status: EngagementStatus,
  reminders: ReminderLog[],
  mod: number,
  course: number,
  totalCourses: number,
  isReprise = false
): EngagementLearner {
  return {
    id,
    firstName,
    lastName,
    email,
    engagement: {
      lastConnectionAt: daysAgo(Math.max(0, daysSince - 1)),
      lastProgressAt: daysAgo(daysSince),
      daysSinceLastActivity: daysSince,
      remindersSent: reminders,
      status,
    },
    currentModule: mod,
    currentCourse: course,
    totalCourses,
    isReprise,
  };
}

// TODO // Supabase: remplacer la mock data par une query
// sur la table students + engagement_tracking
export const mockEngagementLearners: EngagementLearner[] = [
  // --- 3 actifs (< 7j) ---
  make("eng-1", "Marie", "Dupont", "marie.dupont@email.com", 1, "actif", [], 2, 5, 8),
  make("eng-2", "Thomas", "Martin", "thomas.martin@email.com", 3, "actif", [], 3, 3, 8),
  make("eng-3", "Julie", "Moreau", "julie.moreau@email.com", 0, "actif", [], 1, 2, 8),

  // --- 2 a risque niveau 7j ---
  make("eng-4", "Lucas", "Petit", "lucas.petit@email.com", 9, "inactif_7j",
    [reminder(1, 2)], 1, 4, 8),
  make("eng-5", "Emma", "Leroy", "emma.leroy@email.com", 12, "inactif_7j",
    [reminder(1, 5)], 2, 1, 8),

  // --- 1 a risque niveau 14j ---
  make("eng-6", "Hugo", "Garcia", "hugo.garcia@email.com", 18, "inactif_14j",
    [reminder(1, 11), reminder(2, 4)], 1, 6, 8),

  // --- 1 a risque niveau 28j ---
  make("eng-7", "Clara", "Roux", "clara.roux@email.com", 35, "inactif_28j",
    [reminder(1, 28), reminder(2, 21), reminder(3, 7)], 2, 3, 8),

  // --- 2 abandons (42j+) ---
  make("eng-8", "Antoine", "Fournier", "antoine.fournier@email.com", 50, "inactif_42j",
    [reminder(1, 43), reminder(2, 36), reminder(3, 22), reminder(4, 8)], 1, 3, 8),
  make("eng-9", "Camille", "Girard", "camille.girard@email.com", 65, "inactif_42j",
    [reminder(1, 58), reminder(2, 51), reminder(3, 37), reminder(4, 23)], 1, 1, 8),

  // --- 1 reprise ---
  make("eng-10", "Nicolas", "Lambert", "nicolas.lambert@email.com", 2, "actif",
    [reminder(1, 20), reminder(2, 13)], 2, 4, 8, true),
];
