import { describe, it, expect } from "vitest";
import { hasAccess, STATUS_HIERARCHY, STATUS_CONFIG } from "./status";

describe("hasAccess", () => {
  it("decouverte with requirement decouverte → true", () => {
    expect(hasAccess("decouverte", "decouverte")).toBe(true);
  });

  it("decouverte with requirement inscrit → false", () => {
    expect(hasAccess("decouverte", "inscrit")).toBe(false);
  });

  it("inscrit with requirement decouverte → true (hierarchy)", () => {
    expect(hasAccess("inscrit", "decouverte")).toBe(true);
  });

  it("inscrit with requirement inscrit → true", () => {
    expect(hasAccess("inscrit", "inscrit")).toBe(true);
  });

  it("certifie with requirement inscrit → true", () => {
    expect(hasAccess("certifie", "inscrit")).toBe(true);
  });

  it("certifie with requirement decouverte → true", () => {
    expect(hasAccess("certifie", "decouverte")).toBe(true);
  });

  it("certifie with requirement certifie → true", () => {
    expect(hasAccess("certifie", "certifie")).toBe(true);
  });

  it("bloque with requirement decouverte → false", () => {
    expect(hasAccess("bloque", "decouverte")).toBe(false);
  });

  it("bloque with requirement inscrit → false", () => {
    expect(hasAccess("bloque", "inscrit")).toBe(false);
  });

  it("bloque with requirement certifie → false", () => {
    expect(hasAccess("bloque", "certifie")).toBe(false);
  });

  it("hierarchy order: decouverte < inscrit < certifie", () => {
    expect(STATUS_HIERARCHY.indexOf("decouverte")).toBeLessThan(
      STATUS_HIERARCHY.indexOf("inscrit")
    );
    expect(STATUS_HIERARCHY.indexOf("inscrit")).toBeLessThan(
      STATUS_HIERARCHY.indexOf("certifie")
    );
  });
});

describe("STATUS_CONFIG", () => {
  it("has config for all 4 statuses", () => {
    expect(STATUS_CONFIG.decouverte).toBeDefined();
    expect(STATUS_CONFIG.inscrit).toBeDefined();
    expect(STATUS_CONFIG.bloque).toBeDefined();
    expect(STATUS_CONFIG.certifie).toBeDefined();
  });

  it("each config has label, color, bgColor", () => {
    for (const cfg of Object.values(STATUS_CONFIG)) {
      expect(cfg.label).toBeTruthy();
      expect(cfg.color).toBeTruthy();
      expect(cfg.bgColor).toBeTruthy();
    }
  });
});
