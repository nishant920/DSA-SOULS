import { describe, it, expect } from "vitest";
import { pickBonfireProblem } from "../src/lib/bonfire.js";
import { areas } from "../src/data/problems.js";
import { getDefaultState, setStatus } from "../src/state/progress.js";

describe("pickBonfireProblem", () => {
  it("returns null when previous area is undefined or has no cleared problems", () => {
    const state = getDefaultState();
    const area1 = areas[0];

    // No previous area
    expect(pickBonfireProblem(state, null)).toBeNull();

    // Previous area exists but 0 cleared problems
    expect(pickBonfireProblem(state, area1)).toBeNull();
  });

  it("only selects from cleared problems in the previous area", () => {
    let state = getDefaultState();
    const area1 = areas[0];

    // Mark 1 easy as cleared, 1 as died, 1 medium as skipped
    state = setStatus(state, area1.easy[0].id, "cleared");
    state = setStatus(state, area1.easy[1].id, "died");
    state = setStatus(state, area1.medium[0].id, "skipped");

    const picked = pickBonfireProblem(state, area1);
    expect(picked).not.toBeNull();
    expect(picked.id).toBe(area1.easy[0].id);
  });

  it("selects deterministically when custom random function is provided", () => {
    let state = getDefaultState();
    const area1 = areas[0];

    state = setStatus(state, area1.easy[0].id, "cleared");
    state = setStatus(state, area1.easy[1].id, "cleared");
    state = setStatus(state, area1.easy[2].id, "cleared");

    // Mock randomFn returning 0.99 (should pick the last cleared item: index 2)
    const mockRandomMax = () => 0.99;
    const pickedLast = pickBonfireProblem(state, area1, mockRandomMax);
    expect(pickedLast.id).toBe(area1.easy[2].id);

    // Mock randomFn returning 0 (should pick the first cleared item: index 0)
    const mockRandomMin = () => 0.0;
    const pickedFirst = pickBonfireProblem(state, area1, mockRandomMin);
    expect(pickedFirst.id).toBe(area1.easy[0].id);
  });
});
