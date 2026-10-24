import { describe, it, expect } from "vitest";
import { exportNotesAsMarkdown } from "../src/lib/exportNotes.js";
import { areas } from "../src/data/problems.js";
import { getDefaultState, setNote } from "../src/state/progress.js";

describe("exportNotesAsMarkdown", () => {
  it("formats notes into markdown skipping empty areas", () => {
    let state = getDefaultState();
    state = setNote(state, "hashing", "Cue: lookups.\nBug: off-by-one.");
    state = setNote(state, "sliding-window", "Template: left and right pointers.");

    const result = exportNotesAsMarkdown(state, areas);

    expect(result).toContain("# DSA Souls Notes");
    expect(result).toContain("## Hashing and Prefix Sums");
    expect(result).toContain("Cue: lookups.\nBug: off-by-one.");
    expect(result).toContain("## Sliding Window");
    expect(result).toContain("Template: left and right pointers.");
    // Un-noted areas should be omitted
    expect(result).not.toContain("## Two Pointers");
    expect(result).not.toContain("## Binary Search");
  });

  it("handles case where no notes exist", () => {
    const state = getDefaultState();
    const result = exportNotesAsMarkdown(state, areas);

    expect(result).toContain("# DSA Souls Notes");
    expect(result).toContain("_No notes recorded yet._");
  });
});
