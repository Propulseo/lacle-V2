import { describe, it, expect, beforeEach } from "vitest";
import {
  computePnlLevel,
  computeRecommendedPace,
  hasCompletedOnboarding,
  markOnboardingCompleted,
  resetOnboardingStatus,
} from "./onboarding";

beforeEach(() => {
  localStorage.clear();
});

describe("computePnlLevel", () => {
  it("priorKnowledge=non + low rating → debutant", () => {
    expect(computePnlLevel({ priorKnowledge: "non", selfRating: "1" })).toBe("debutant");
  });

  it("priorKnowledge=non + high rating → debutant (prior trumps)", () => {
    expect(computePnlLevel({ priorKnowledge: "non", selfRating: "5" })).toBe("debutant");
  });

  it("rating <= 2 regardless of prior → debutant", () => {
    expect(computePnlLevel({ priorKnowledge: "bases", selfRating: "2" })).toBe("debutant");
  });

  it("priorKnowledge=vaguement + rating=3 → initie", () => {
    expect(computePnlLevel({ priorKnowledge: "vaguement", selfRating: "3" })).toBe("initie");
  });

  it("priorKnowledge=vaguement + rating=4 → initie", () => {
    expect(computePnlLevel({ priorKnowledge: "vaguement", selfRating: "4" })).toBe("initie");
  });

  it("priorKnowledge=bases + rating=4 → avance", () => {
    expect(computePnlLevel({ priorKnowledge: "bases", selfRating: "4" })).toBe("avance");
  });

  it("priorKnowledge=bases + rating=5 → avance", () => {
    expect(computePnlLevel({ priorKnowledge: "bases", selfRating: "5" })).toBe("avance");
  });

  it("priorKnowledge=bases + rating=3 → initie (rating too low for avance)", () => {
    expect(computePnlLevel({ priorKnowledge: "bases", selfRating: "3" })).toBe("initie");
  });

  it("missing values → debutant", () => {
    expect(computePnlLevel({})).toBe("debutant");
  });
});

describe("computeRecommendedPace", () => {
  it("motivation=1 → lent", () => {
    expect(computeRecommendedPace({ motivationLevel: "1" })).toBe("lent");
  });

  it("motivation=2 → lent", () => {
    expect(computeRecommendedPace({ motivationLevel: "2" })).toBe("lent");
  });

  it("motivation=3 → normal", () => {
    expect(computeRecommendedPace({ motivationLevel: "3" })).toBe("normal");
  });

  it("motivation=4 → intensif", () => {
    expect(computeRecommendedPace({ motivationLevel: "4" })).toBe("intensif");
  });

  it("motivation=5 → intensif", () => {
    expect(computeRecommendedPace({ motivationLevel: "5" })).toBe("intensif");
  });

  it("missing motivation → lent (parsed as 0)", () => {
    expect(computeRecommendedPace({})).toBe("lent");
  });
});

describe("onboarding localStorage flags", () => {
  it("hasCompletedOnboarding returns false by default", () => {
    expect(hasCompletedOnboarding()).toBe(false);
  });

  it("returns true after markOnboardingCompleted", () => {
    markOnboardingCompleted();
    expect(hasCompletedOnboarding()).toBe(true);
  });

  it("resetOnboardingStatus clears the flag", () => {
    markOnboardingCompleted();
    expect(hasCompletedOnboarding()).toBe(true);
    resetOnboardingStatus();
    expect(hasCompletedOnboarding()).toBe(false);
  });
});
