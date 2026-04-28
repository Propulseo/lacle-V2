import { describe, it, expect } from "vitest";
import { getCapsuleDisplayName } from "./capsule-utils";

describe("getCapsuleDisplayName", () => {
  it("isCompleted=false + title defined → returns the code", () => {
    expect(getCapsuleDisplayName("1A1", "Introduction a la PNL", false)).toBe("1A1");
  });

  it("isCompleted=true + title defined → returns the title", () => {
    expect(getCapsuleDisplayName("1A1", "Introduction a la PNL", true)).toBe(
      "Introduction a la PNL"
    );
  });

  it("isCompleted=true + title undefined → returns the code", () => {
    expect(getCapsuleDisplayName("2B3", undefined, true)).toBe("2B3");
  });

  it("isCompleted=false + title undefined → returns the code", () => {
    expect(getCapsuleDisplayName("3C1", undefined, false)).toBe("3C1");
  });

  it("isCompleted=true + title empty string → returns the code", () => {
    expect(getCapsuleDisplayName("4D2", "", true)).toBe("4D2");
  });

  it("preserves code formatting exactly", () => {
    expect(getCapsuleDisplayName("10Z99", "Some Title", false)).toBe("10Z99");
  });
});
