import { describe, it, expect } from "vitest";
import { validateProgressData } from "../src/lib/validate.js";

describe("validateProgressData", () => {
  const validData = {
    version: 1,
    problems: {
      "lc-1": { status: "cleared", diedOn: null, clearedOn: "2026-10-24" },
      "lc-2": { status: "died", diedOn: "2026-10-24", clearedOn: null }
    },
    notes: {
      "hashing": "Lookups with hash map."
    },
    bossSkipped: {
      "hashing": false
    }
  };

  it("passes with valid data", () => {
    const res = validateProgressData(validData);
    expect(res.valid).toBe(true);
    expect(res.state.problems["lc-1"].status).toBe("cleared");
    expect(res.state.notes["hashing"]).toBe("Lookups with hash map.");
  });

  it("fails on null or non-object input", () => {
    expect(validateProgressData(null).valid).toBe(false);
    expect(validateProgressData("string").valid).toBe(false);
    expect(validateProgressData([]).valid).toBe(false);
  });

  it("fails when missing version", () => {
    const noVersion = { ...validData };
    delete noVersion.version;
    const res = validateProgressData(noVersion);
    expect(res.valid).toBe(false);
    expect(res.error).toContain("version");
  });

  it("fails when missing problems or notes or bossSkipped", () => {
    const noNotes = { ...validData };
    delete noNotes.notes;
    expect(validateProgressData(noNotes).valid).toBe(false);

    const noProblems = { ...validData };
    delete noProblems.problems;
    expect(validateProgressData(noProblems).valid).toBe(false);

    const noBossSkipped = { ...validData };
    delete noBossSkipped.bossSkipped;
    expect(validateProgressData(noBossSkipped).valid).toBe(false);
  });

  it("fails when problems map has wrong types or invalid statuses", () => {
    const invalidStatus = {
      ...validData,
      problems: {
        "lc-1": { status: "hacked" }
      }
    };
    expect(validateProgressData(invalidStatus).valid).toBe(false);

    const nonObjectProblem = {
      ...validData,
      problems: {
        "lc-1": "not-an-object"
      }
    };
    expect(validateProgressData(nonObjectProblem).valid).toBe(false);
  });

  it("fails when notes values are not strings", () => {
    const nonStringNote = {
      ...validData,
      notes: {
        "hashing": 12345
      }
    };
    expect(validateProgressData(nonStringNote).valid).toBe(false);
  });

  it("fails when bossSkipped values are not booleans", () => {
    const nonBoolSkipped = {
      ...validData,
      bossSkipped: {
        "hashing": "yes"
      }
    };
    expect(validateProgressData(nonBoolSkipped).valid).toBe(false);
  });
});
