import { describe, it, expect } from "vitest";
import { computeExamStatus } from "./exam-logic";
import type { LegacyExamAttempt } from "@/types";

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

function makeAttempt(overrides: Partial<LegacyExamAttempt> = {}): LegacyExamAttempt {
  return {
    id: crypto.randomUUID(),
    examId: "exam-1",
    learnerId: "learner-1",
    answers: {},
    score: 40,
    passed: false,
    completedAt: new Date().toISOString(),
    ...overrides,
  };
}

function attemptsAt(times: number[], opts: Partial<LegacyExamAttempt> = {}): LegacyExamAttempt[] {
  return times.map((t) => makeAttempt({ completedAt: new Date(t).toISOString(), ...opts }));
}

// ─── MODULE EXAMS ────────────────────────────────────────────────────────────

describe("computeExamStatus — module", () => {
  it("0 attempts → canAttempt true", () => {
    const s = computeExamStatus([], "module");
    expect(s.canAttempt).toBe(true);
    expect(s.attemptsToday).toBe(0);
  });

  it("1 attempt → canAttempt true (no delay)", () => {
    const now = Date.now();
    const s = computeExamStatus(attemptsAt([now - 1000]), "module", now);
    expect(s.canAttempt).toBe(true);
  });

  it("2 consecutive attempts → canAttempt false (1h delay required)", () => {
    const now = Date.now();
    const attempts = attemptsAt([now - 30_000, now - 10_000]);
    const s = computeExamStatus(attempts, "module", now);
    expect(s.canAttempt).toBe(false);
    expect(s.blockedUntil).not.toBeNull();
  });

  it("3 attempts with 1h+ gap after 2nd → canAttempt true", () => {
    const now = Date.now();
    const attempts = attemptsAt([
      now - 3 * HOUR,
      now - 2 * HOUR,
      now - HOUR - 60_000,
    ]);
    const s = computeExamStatus(attempts, "module", now);
    expect(s.canAttempt).toBe(true);
  });

  it("5 attempts in 24h → isBlocked true, blockedUntil set", () => {
    const now = Date.now();
    const attempts = attemptsAt([
      now - 4 * HOUR,
      now - 3 * HOUR,
      now - 2 * HOUR,
      now - HOUR,
      now - 5 * 60_000,
    ]);
    const s = computeExamStatus(attempts, "module", now);
    expect(s.isBlocked).toBe(true);
    expect(s.blockedUntil).not.toBeNull();
    expect(s.canAttempt).toBe(false);
  });

  it("5 attempts over 25h → reset, canAttempt true", () => {
    const now = Date.now();
    const attempts = attemptsAt([
      now - 25 * HOUR,
      now - 24.5 * HOUR,
      now - 24.2 * HOUR,
      now - 24.1 * HOUR,
      now - HOUR - 60_000,
    ]);
    const s = computeExamStatus(attempts, "module", now);
    expect(s.canAttempt).toBe(true);
  });

  it("passed exam → canAttempt false", () => {
    const s = computeExamStatus([makeAttempt({ passed: true, score: 80 })], "module");
    expect(s.canAttempt).toBe(false);
  });
});

// ─── FINAL EXAM ──────────────────────────────────────────────────────────────

describe("computeExamStatus — final", () => {
  it("0 attempts → canAttempt true", () => {
    const s = computeExamStatus([], "final");
    expect(s.canAttempt).toBe(true);
  });

  it("1 attempt J1 → canAttempt true", () => {
    const now = Date.now();
    const s = computeExamStatus(attemptsAt([now - 1000]), "final", now);
    expect(s.canAttempt).toBe(true);
  });

  it("2 attempts J1 → blocked 24h", () => {
    const now = Date.now();
    const attempts = attemptsAt([now - 30_000, now - 10_000]);
    const s = computeExamStatus(attempts, "final", now);
    expect(s.canAttempt).toBe(false);
    expect(s.isBlocked).toBe(true);
    expect(s.blockedUntil).not.toBeNull();
    expect(s.blockedUntil!.getTime()).toBeGreaterThan(now);
  });

  it("3 attempts (J1×2 + J3×1) → blocked 48h", () => {
    const now = Date.now();
    const attempts = attemptsAt([
      now - 4 * DAY,
      now - 4 * DAY + 1000,
      now - 10_000,
    ]);
    const s = computeExamStatus(attempts, "final", now);
    expect(s.canAttempt).toBe(false);
    expect(s.isBlocked).toBe(true);
    expect(s.blockedUntil!.getTime()).toBeGreaterThan(now + DAY);
  });

  it("4 attempts total → isDefinitivelyBlocked true", () => {
    const now = Date.now();
    const attempts = attemptsAt([
      now - 10 * DAY,
      now - 10 * DAY + 1000,
      now - 7 * DAY,
      now - 4 * DAY,
    ]);
    const s = computeExamStatus(attempts, "final", now);
    expect(s.isDefinitivelyBlocked).toBe(true);
    expect(s.canAttempt).toBe(false);
  });

  it("passed at any attempt → canAttempt false", () => {
    const now = Date.now();
    const attempts = [
      makeAttempt({ completedAt: new Date(now - DAY).toISOString() }),
      makeAttempt({ completedAt: new Date(now - 1000).toISOString(), passed: true, score: 85 }),
    ];
    const s = computeExamStatus(attempts, "final", now);
    expect(s.canAttempt).toBe(false);
    expect(s.isDefinitivelyBlocked).toBe(false);
  });

  it("2 attempts + 24h expired → canAttempt true (J3 unlocked)", () => {
    const now = Date.now();
    const attempts = attemptsAt([
      now - 3 * DAY,
      now - 3 * DAY + 1000,
    ]);
    const s = computeExamStatus(attempts, "final", now);
    expect(s.canAttempt).toBe(true);
    expect(s.isBlocked).toBe(false);
  });

  it("3 attempts + 48h expired → canAttempt true (J5 unlocked)", () => {
    const now = Date.now();
    const attempts = attemptsAt([
      now - 10 * DAY,
      now - 10 * DAY + 1000,
      now - 5 * DAY,
    ]);
    const s = computeExamStatus(attempts, "final", now);
    expect(s.canAttempt).toBe(true);
    expect(s.isBlocked).toBe(false);
  });
});
