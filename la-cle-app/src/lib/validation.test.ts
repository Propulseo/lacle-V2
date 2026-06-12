import { describe, it, expect } from "vitest";
import {
  isBlank,
  isValidEmail,
  isValidPhoneFr,
  isValidHttpUrl,
  isPositiveInt,
  isTimeRangeValid,
  isTodayOrFuture,
  passwordStrengthError,
  collectErrors,
} from "./validation";

describe("isBlank", () => {
  it("detects empty and whitespace-only strings", () => {
    expect(isBlank("")).toBe(true);
    expect(isBlank("   ")).toBe(true);
    expect(isBlank("\t\n")).toBe(true);
  });

  it("accepts non-empty strings", () => {
    expect(isBlank("a")).toBe(false);
    expect(isBlank("  a  ")).toBe(false);
  });
});

describe("isValidEmail", () => {
  it("accepts standard addresses", () => {
    expect(isValidEmail("marien@institutlacle.fr")).toBe(true);
    expect(isValidEmail("  prenom.nom@exemple.com  ")).toBe(true);
  });

  it("rejects malformed addresses", () => {
    expect(isValidEmail("")).toBe(false);
    expect(isValidEmail("sans-arobase.fr")).toBe(false);
    expect(isValidEmail("a@b")).toBe(false);
    expect(isValidEmail("a @b.fr")).toBe(false);
    expect(isValidEmail("a@b.f")).toBe(false);
  });
});

describe("isValidPhoneFr", () => {
  it("accepts French formats with separators", () => {
    expect(isValidPhoneFr("0612345678")).toBe(true);
    expect(isValidPhoneFr("06 12 34 56 78")).toBe(true);
    expect(isValidPhoneFr("06.12.34.56.78")).toBe(true);
    expect(isValidPhoneFr("06-12-34-56-78")).toBe(true);
    expect(isValidPhoneFr("+33612345678")).toBe(true);
    expect(isValidPhoneFr("+33 6 12 34 56 78")).toBe(true);
  });

  it("rejects invalid numbers", () => {
    expect(isValidPhoneFr("")).toBe(false);
    expect(isValidPhoneFr("061234567")).toBe(false);
    expect(isValidPhoneFr("06123456789")).toBe(false);
    expect(isValidPhoneFr("0012345678")).toBe(false);
    expect(isValidPhoneFr("abcdefghij")).toBe(false);
  });
});

describe("isValidHttpUrl", () => {
  it("accepts http(s) URLs", () => {
    expect(isValidHttpUrl("https://exemple.fr/video.mp4")).toBe(true);
    expect(isValidHttpUrl("http://exemple.fr")).toBe(true);
  });

  it("rejects other protocols and garbage", () => {
    expect(isValidHttpUrl("ftp://exemple.fr")).toBe(false);
    expect(isValidHttpUrl("javascript:alert(1)")).toBe(false);
    expect(isValidHttpUrl("exemple.fr")).toBe(false);
    expect(isValidHttpUrl("")).toBe(false);
  });
});

describe("isPositiveInt", () => {
  it("validates integers against the default minimum of 1", () => {
    expect(isPositiveInt(1)).toBe(true);
    expect(isPositiveInt(42)).toBe(true);
    expect(isPositiveInt(0)).toBe(false);
    expect(isPositiveInt(-3)).toBe(false);
    expect(isPositiveInt(1.5)).toBe(false);
    expect(isPositiveInt(NaN)).toBe(false);
  });

  it("honours a custom minimum", () => {
    expect(isPositiveInt(0, 0)).toBe(true);
    expect(isPositiveInt(-1, 0)).toBe(false);
  });
});

describe("isTimeRangeValid", () => {
  it("requires the end to be strictly after the start", () => {
    expect(isTimeRangeValid("09:00", "17:00")).toBe(true);
    expect(isTimeRangeValid("09:00", "09:00")).toBe(false);
    expect(isTimeRangeValid("17:00", "09:00")).toBe(false);
  });

  it("rejects missing values", () => {
    expect(isTimeRangeValid("", "17:00")).toBe(false);
    expect(isTimeRangeValid("09:00", "")).toBe(false);
  });
});

describe("isTodayOrFuture", () => {
  it("accepts today and future dates", () => {
    const now = new Date();
    const todayIso = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
    ].join("-");
    expect(isTodayOrFuture(todayIso)).toBe(true);
    expect(isTodayOrFuture("2099-01-01")).toBe(true);
  });

  it("rejects past dates and missing values", () => {
    expect(isTodayOrFuture("2000-01-01")).toBe(false);
    expect(isTodayOrFuture("")).toBe(false);
  });
});

describe("passwordStrengthError", () => {
  it("returns null for a strong enough password", () => {
    expect(passwordStrengthError("motdepasse1")).toBeNull();
  });

  it("flags short passwords first", () => {
    expect(passwordStrengthError("abc1")).toMatch(/8 caractères/);
  });

  it("requires at least one digit", () => {
    expect(passwordStrengthError("motdepasse")).toMatch(/chiffre/);
  });

  it("requires at least one letter", () => {
    expect(passwordStrengthError("12345678")).toMatch(/lettre/);
  });
});

describe("collectErrors", () => {
  it("returns an empty object when everything is valid", () => {
    expect(collectErrors([["title", false, "Requis."]])).toEqual({});
  });

  it("collects the first error per field only", () => {
    const errors = collectErrors([
      ["title", true, "Veuillez renseigner un titre."],
      ["title", true, "Autre erreur."],
      ["order", true, "L'ordre doit être supérieur ou égal à 1."],
      ["email", false, "Email invalide."],
    ]);
    expect(errors).toEqual({
      title: "Veuillez renseigner un titre.",
      order: "L'ordre doit être supérieur ou égal à 1.",
    });
  });
});
