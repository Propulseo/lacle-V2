import { describe, it, expect } from "vitest";
import {
  getModuleAccessDecision,
  canTakeModuleExam,
  TRIAL_MAX_ACCESSIBLE_ORDER,
  ENROLLMENT_GATE_ORDER,
} from "./module-access";

describe("getModuleAccessDecision — statut decouverte", () => {
  it("autorise les cours 1 a 7", () => {
    expect(getModuleAccessDecision(1, "decouverte", false)).toBe("allowed");
    expect(getModuleAccessDecision(6, "decouverte", false)).toBe("allowed");
    expect(getModuleAccessDecision(7, "decouverte", false)).toBe("allowed");
  });

  it("bloque au-dela du cours 7 (TrialGate prioritaire sur l'inscription)", () => {
    expect(getModuleAccessDecision(8, "decouverte", false)).toBe("trial_blocked");
    expect(getModuleAccessDecision(9, "decouverte", true)).toBe("trial_blocked");
  });
});

describe("getModuleAccessDecision — statut inscrit", () => {
  it("autorise les cours 1 a 7 sans condition", () => {
    expect(getModuleAccessDecision(1, "inscrit", false)).toBe("allowed");
    expect(getModuleAccessDecision(7, "inscrit", false)).toBe("allowed");
  });

  it("exige l'inscription complete a partir du cours 8", () => {
    expect(getModuleAccessDecision(8, "inscrit", false)).toBe("enrollment_required");
    expect(getModuleAccessDecision(9, "inscrit", false)).toBe("enrollment_required");
  });

  it("autorise le cours 8 quand contrat + CGV + paiement sont valides", () => {
    expect(getModuleAccessDecision(8, "inscrit", true)).toBe("allowed");
  });
});

describe("getModuleAccessDecision — statut inconnu (null)", () => {
  it("ne declenche pas le TrialGate mais conserve le gate d'inscription", () => {
    expect(getModuleAccessDecision(7, null, false)).toBe("allowed");
    expect(getModuleAccessDecision(8, null, false)).toBe("enrollment_required");
  });
});

describe("canTakeModuleExam", () => {
  it("decouverte : examens des cours 1 a 6 passables, cours 7 bloque", () => {
    expect(canTakeModuleExam(1, "decouverte")).toBe(true);
    expect(canTakeModuleExam(6, "decouverte")).toBe(true);
    expect(canTakeModuleExam(7, "decouverte")).toBe(false);
    expect(canTakeModuleExam(8, "decouverte")).toBe(false);
  });

  it("inscrit/certifie : aucun blocage d'examen", () => {
    expect(canTakeModuleExam(7, "inscrit")).toBe(true);
    expect(canTakeModuleExam(7, "certifie")).toBe(true);
    expect(canTakeModuleExam(7, null)).toBe(true);
  });
});

describe("constantes", () => {
  it("correspondent au parcours documente", () => {
    expect(TRIAL_MAX_ACCESSIBLE_ORDER).toBe(7);
    expect(ENROLLMENT_GATE_ORDER).toBe(8);
  });
});
