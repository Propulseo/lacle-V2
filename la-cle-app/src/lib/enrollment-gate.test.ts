import { describe, it, expect, beforeEach } from "vitest";
import {
  getEnrollmentConditions,
  isEnrollmentComplete,
  markContractSigned,
  markCgvAccepted,
  getPaymentStatus,
} from "./enrollment-gate";

beforeEach(() => {
  localStorage.clear();
});

describe("getEnrollmentConditions", () => {
  it("returns all false when localStorage is empty", () => {
    const c = getEnrollmentConditions();
    expect(c.contractSigned).toBe(false);
    expect(c.cgvAccepted).toBe(false);
    expect(c.paymentActive).toBe(false);
  });

  it("reads contractSigned from localStorage", () => {
    localStorage.setItem("enrollment_contract_signed", "true");
    expect(getEnrollmentConditions().contractSigned).toBe(true);
  });

  it("reads cgvAccepted from localStorage", () => {
    localStorage.setItem("enrollment_cgv_accepted", "true");
    expect(getEnrollmentConditions().cgvAccepted).toBe(true);
  });

  it("reads paymentActive from localStorage", () => {
    localStorage.setItem("enrollment_payment_status", "active");
    expect(getEnrollmentConditions().paymentActive).toBe(true);
  });
});

describe("isEnrollmentComplete", () => {
  it("0 conditions → access denied", () => {
    expect(isEnrollmentComplete()).toBe(false);
  });

  it("1 condition (contractSigned) → access denied", () => {
    markContractSigned();
    expect(isEnrollmentComplete()).toBe(false);
    const c = getEnrollmentConditions();
    expect(c.contractSigned).toBe(true);
    expect(c.cgvAccepted).toBe(false);
    expect(c.paymentActive).toBe(false);
  });

  it("2 conditions → access denied", () => {
    markContractSigned();
    markCgvAccepted();
    expect(isEnrollmentComplete()).toBe(false);
  });

  it("3 conditions (all fulfilled) → access granted", () => {
    markContractSigned();
    markCgvAccepted();
    localStorage.setItem("enrollment_payment_status", "active");
    expect(isEnrollmentComplete()).toBe(true);
  });

  it("contract + cgv + payment=failed → access denied", () => {
    markContractSigned();
    markCgvAccepted();
    localStorage.setItem("enrollment_payment_status", "failed");
    expect(isEnrollmentComplete()).toBe(false);
  });

  it("contract + cgv + payment=active → access granted", () => {
    markContractSigned();
    markCgvAccepted();
    localStorage.setItem("enrollment_payment_status", "active");
    expect(isEnrollmentComplete()).toBe(true);
  });
});

describe("getPaymentStatus", () => {
  it("returns 'trial' when empty", () => {
    expect(getPaymentStatus()).toBe("trial");
  });

  it("returns 'active' when set", () => {
    localStorage.setItem("enrollment_payment_status", "active");
    expect(getPaymentStatus()).toBe("active");
  });

  it("returns 'failed' when set", () => {
    localStorage.setItem("enrollment_payment_status", "failed");
    expect(getPaymentStatus()).toBe("failed");
  });

  it("returns 'trial' for unknown values", () => {
    localStorage.setItem("enrollment_payment_status", "unknown");
    expect(getPaymentStatus()).toBe("trial");
  });
});

describe("markContractSigned / markCgvAccepted", () => {
  it("persists contract signed flag", () => {
    markContractSigned();
    expect(localStorage.getItem("enrollment_contract_signed")).toBe("true");
  });

  it("persists cgv accepted flag", () => {
    markCgvAccepted();
    expect(localStorage.getItem("enrollment_cgv_accepted")).toBe("true");
  });
});
