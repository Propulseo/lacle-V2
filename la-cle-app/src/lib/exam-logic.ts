import type { LegacyExamAttempt, ExamType } from "@/types";

export interface ExamStatus {
  canAttempt: boolean;
  nextAttemptAt: Date | null;
  attemptsToday: number;
  isBlocked: boolean;
  blockedUntil: Date | null;
  isDefinitivelyBlocked: boolean;
}

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

function parseDate(s: string): Date {
  return new Date(s);
}

function computeModuleStatus(attempts: LegacyExamAttempt[], now: number): ExamStatus {
  if (attempts.length === 0) {
    return { canAttempt: true, nextAttemptAt: null, attemptsToday: 0, isBlocked: false, blockedUntil: null, isDefinitivelyBlocked: false };
  }

  const sorted = [...attempts].sort(
    (a, b) => parseDate(b.completedAt).getTime() - parseDate(a.completedAt).getTime()
  );

  // Already passed
  if (sorted.some((a) => a.passed)) {
    return { canAttempt: false, nextAttemptAt: null, attemptsToday: sorted.length, isBlocked: false, blockedUntil: null, isDefinitivelyBlocked: false };
  }

  // Count attempts in the last 24h sliding window
  const cutoff24h = now - DAY;
  const todayAttempts = sorted.filter((a) => parseDate(a.completedAt).getTime() > cutoff24h);
  const attemptsToday = todayAttempts.length;

  // 5 attempts in 24h -> blocked 24h from the 5th
  if (attemptsToday >= 5) {
    // The 5th most recent in the 24h window
    const times = todayAttempts.map((a) => parseDate(a.completedAt).getTime()).sort((a, b) => a - b);
    const blockedUntil = new Date(times[0] + DAY);
    if (blockedUntil.getTime() > now) {
      return { canAttempt: false, nextAttemptAt: blockedUntil, attemptsToday, isBlocked: true, blockedUntil, isDefinitivelyBlocked: false };
    }
  }

  const lastTime = parseDate(sorted[0].completedAt).getTime();

  // First 2 attempts: no delay
  if (attempts.length < 2) {
    return { canAttempt: true, nextAttemptAt: null, attemptsToday, isBlocked: false, blockedUntil: null, isDefinitivelyBlocked: false };
  }

  // After 2 attempts: 1h between each
  const nextAt = new Date(lastTime + HOUR);
  if (nextAt.getTime() > now) {
    return { canAttempt: false, nextAttemptAt: nextAt, attemptsToday, isBlocked: true, blockedUntil: nextAt, isDefinitivelyBlocked: false };
  }

  return { canAttempt: true, nextAttemptAt: null, attemptsToday, isBlocked: false, blockedUntil: null, isDefinitivelyBlocked: false };
}

function computeFinalStatus(attempts: LegacyExamAttempt[], now: number): ExamStatus {
  const total = attempts.length;

  if (attempts.some((a) => a.passed)) {
    return { canAttempt: false, nextAttemptAt: null, attemptsToday: total, isBlocked: false, blockedUntil: null, isDefinitivelyBlocked: false };
  }

  const sorted = [...attempts].sort(
    (a, b) => parseDate(a.completedAt).getTime() - parseDate(b.completedAt).getTime()
  );

  // J1: 2 attempts
  if (total < 2) {
    return { canAttempt: true, nextAttemptAt: null, attemptsToday: total, isBlocked: false, blockedUntil: null, isDefinitivelyBlocked: false };
  }

  // After 2nd attempt: block 24h
  if (total === 2) {
    const blockedUntil = new Date(parseDate(sorted[1].completedAt).getTime() + DAY);
    if (blockedUntil.getTime() > now) {
      return { canAttempt: false, nextAttemptAt: blockedUntil, attemptsToday: total, isBlocked: true, blockedUntil, isDefinitivelyBlocked: false };
    }
    return { canAttempt: true, nextAttemptAt: null, attemptsToday: total, isBlocked: false, blockedUntil: null, isDefinitivelyBlocked: false };
  }

  // After 3rd attempt: block 48h
  if (total === 3) {
    const blockedUntil = new Date(parseDate(sorted[2].completedAt).getTime() + 2 * DAY);
    if (blockedUntil.getTime() > now) {
      return { canAttempt: false, nextAttemptAt: blockedUntil, attemptsToday: total, isBlocked: true, blockedUntil, isDefinitivelyBlocked: false };
    }
    return { canAttempt: true, nextAttemptAt: null, attemptsToday: total, isBlocked: false, blockedUntil: null, isDefinitivelyBlocked: false };
  }

  // 4+ attempts: definitively blocked
  return { canAttempt: false, nextAttemptAt: null, attemptsToday: total, isBlocked: true, blockedUntil: null, isDefinitivelyBlocked: true };
}

export function computeExamStatus(
  attempts: LegacyExamAttempt[],
  examType: ExamType,
  now: number = Date.now()
): ExamStatus {
  return examType === "final"
    ? computeFinalStatus(attempts, now)
    : computeModuleStatus(attempts, now);
}
