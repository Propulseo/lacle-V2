import { describe, it, expect, beforeEach } from "vitest";
import {
  computePositioningResult,
  hasCompletedPositioning,
  markPositioningCompleted,
  POSITIONING_QUESTIONS,
} from "./positioning";

beforeEach(() => {
  localStorage.clear();
});

function allCorrectAnswers(): Record<string, string> {
  const answers: Record<string, string> = {};
  for (const q of POSITIONING_QUESTIONS) {
    if (q.scored && q.correctAnswer) {
      answers[q.id] = q.correctAnswer;
    } else if (q.kind === "textarea") {
      answers[q.id] = "Some text";
    } else if ("options" in q) {
      answers[q.id] = q.options[0].value;
    }
  }
  return answers;
}

function allWrongAnswers(): Record<string, string> {
  const answers: Record<string, string> = {};
  for (const q of POSITIONING_QUESTIONS) {
    if (q.kind === "textarea") {
      answers[q.id] = "text";
    } else if ("options" in q) {
      const wrong = q.options.find((o) => o.value !== q.correctAnswer);
      answers[q.id] = wrong?.value ?? q.options[0].value;
    }
  }
  return answers;
}

const scoredCount = POSITIONING_QUESTIONS.filter((q) => q.scored).length;

describe("computePositioningResult — scoring thresholds", () => {
  // With 4 scored questions: max score = 4
  // Thresholds: < 4 → debutant, 4-7 → initie, > 7 → avance

  it("all correct answers → score equals scored question count", () => {
    const result = computePositioningResult(allCorrectAnswers());
    expect(result.score).toBe(scoredCount);
  });

  it("all correct (4/4) → initie (score 4, within 4-7 range)", () => {
    const result = computePositioningResult(allCorrectAnswers());
    expect(result.score).toBe(4);
    expect(result.startingLevel).toBe("initie");
    expect(result.recommendations.length).toBeGreaterThan(0);
  });

  it("0 correct → debutant", () => {
    const result = computePositioningResult(allWrongAnswers());
    expect(result.score).toBe(0);
    expect(result.startingLevel).toBe("debutant");
    expect(result.recommendations.length).toBeGreaterThan(0);
  });

  it("empty answers → debutant (score 0)", () => {
    const result = computePositioningResult({});
    expect(result.score).toBe(0);
    expect(result.startingLevel).toBe("debutant");
  });

  it("score exactly 3 → debutant (below threshold)", () => {
    const correct = allCorrectAnswers();
    const scored = POSITIONING_QUESTIONS.filter((q) => q.scored);
    // Break 1 scored answer to get score = 3
    const q = scored[0];
    if ("options" in q) {
      const wrong = q.options.find((o) => o.value !== q.correctAnswer);
      if (wrong) correct[q.id] = wrong.value;
    }
    const result = computePositioningResult(correct);
    expect(result.score).toBe(3);
    expect(result.startingLevel).toBe("debutant");
  });

  it("score exactly 4 → initie (at boundary)", () => {
    const result = computePositioningResult(allCorrectAnswers());
    expect(result.score).toBe(4);
    expect(result.startingLevel).toBe("initie");
  });

  it("avance threshold requires score > 7 (unreachable with 4 scored Qs)", () => {
    // Verify that with current questions, avance is unreachable
    expect(scoredCount).toBeLessThanOrEqual(7);
  });

  it("recommendations are non-empty for debutant", () => {
    const r = computePositioningResult({});
    expect(r.recommendations.length).toBeGreaterThan(0);
  });

  it("recommendations are non-empty for initie", () => {
    const r = computePositioningResult(allCorrectAnswers());
    expect(r.recommendations.length).toBeGreaterThan(0);
  });

  it("includes completedAt date", () => {
    const result = computePositioningResult({});
    expect(result.completedAt).toBeInstanceOf(Date);
  });
});

describe("hasCompletedPositioning / markPositioningCompleted", () => {
  it("returns false by default", () => {
    expect(hasCompletedPositioning()).toBe(false);
  });

  it("returns true after marking completed", () => {
    const result = computePositioningResult(allCorrectAnswers());
    markPositioningCompleted(result);
    expect(hasCompletedPositioning()).toBe(true);
  });

  it("persists result to localStorage", () => {
    const result = computePositioningResult(allCorrectAnswers());
    markPositioningCompleted(result);
    const stored = localStorage.getItem("positioning_test_result");
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored!);
    expect(parsed.startingLevel).toBe("initie");
  });
});
