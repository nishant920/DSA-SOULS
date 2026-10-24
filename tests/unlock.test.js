import { describe, it, expect } from "vitest";
import {
  isDone,
  areaProgress,
  isBossUnlocked,
  isAreaUnlocked,
  isSideQuestUnlocked,
  isHiddenBossVisible,
  needsResolve
} from "../src/lib/unlock.js";
import { areas, sideQuest } from "../src/data/problems.js";
import { getDefaultState, setStatus, setBossSkipped } from "../src/state/progress.js";

describe("Game Rules & Unlock Logic", () => {
  it("determines if a problem is done (cleared or skipped)", () => {
    let state = getDefaultState();
    expect(isDone(state, "lc-1")).toBe(false);

    state = setStatus(state, "lc-1", "cleared");
    expect(isDone(state, "lc-1")).toBe(true);

    state = setStatus(state, "lc-2", "skipped");
    expect(isDone(state, "lc-2")).toBe(true);

    state = setStatus(state, "lc-3", "died");
    expect(isDone(state, "lc-3")).toBe(false);
  });

  it("calculates areaProgress correctly", () => {
    let state = getDefaultState();
    const area1 = areas[0]; // 4 easy, 6 medium, 1 boss = 11 total
    expect(areaProgress(state, area1)).toEqual({ done: 0, total: 11 });

    state = setStatus(state, area1.easy[0].id, "cleared");
    state = setStatus(state, area1.easy[1].id, "skipped");
    expect(areaProgress(state, area1)).toEqual({ done: 2, total: 11 });
  });

  it("keeps boss locked with 5/6 mediums cleared", () => {
    let state = getDefaultState();
    const area1 = areas[0];

    // Clear 5 mediums out of 6
    for (let i = 0; i < 5; i++) {
      state = setStatus(state, area1.medium[i].id, "cleared");
    }

    expect(isBossUnlocked(state, area1)).toBe(false);
  });

  it("unlocks boss when all 6 mediums are cleared", () => {
    let state = getDefaultState();
    const area1 = areas[0];

    // Clear all 6 mediums
    for (let i = 0; i < 6; i++) {
      state = setStatus(state, area1.medium[i].id, "cleared");
    }

    expect(isBossUnlocked(state, area1)).toBe(true);
  });

  it("unlocks next area by boss clear and by boss skip", () => {
    let state = getDefaultState();
    const area1 = areas[0];
    const area2 = areas[1];

    // Area 1 is always unlocked
    expect(isAreaUnlocked(state, areas, area1.id)).toBe(true);
    // Area 2 is locked initially
    expect(isAreaUnlocked(state, areas, area2.id)).toBe(false);

    // Case 1: Unlock Area 2 via boss clear
    let clearedState = setStatus(state, area1.boss.id, "cleared");
    expect(isAreaUnlocked(clearedState, areas, area2.id)).toBe(true);

    // Case 2: Unlock Area 2 via boss skip
    let skippedState = setBossSkipped(state, area1.id, true);
    expect(isAreaUnlocked(skippedState, areas, area2.id)).toBe(true);
  });

  it("unlocks side quest (Archdragon Peak) only when trees area is fully cleared/skipped", () => {
    let state = getDefaultState();
    const treesArea = areas.find((a) => a.id === "trees");

    expect(isSideQuestUnlocked(state, areas, sideQuest)).toBe(false);

    // Clear all easies
    treesArea.easy.forEach((p) => {
      state = setStatus(state, p.id, "cleared");
    });
    expect(isSideQuestUnlocked(state, areas, sideQuest)).toBe(false);

    // Clear all mediums
    treesArea.medium.forEach((p) => {
      state = setStatus(state, p.id, "cleared");
    });
    expect(isSideQuestUnlocked(state, areas, sideQuest)).toBe(false);

    // Boss clear unlocks side quest
    let stateBossCleared = setStatus(state, treesArea.boss.id, "cleared");
    expect(isSideQuestUnlocked(stateBossCleared, areas, sideQuest)).toBe(true);

    // Alternatively, boss skip unlocks side quest
    let stateBossSkipped = setBossSkipped(state, treesArea.id, true);
    expect(isSideQuestUnlocked(stateBossSkipped, areas, sideQuest)).toBe(true);
  });

  it("checks hidden boss visibility only when Area 8 boss is cleared", () => {
    let state = getDefaultState();
    const heapArea = areas.find((a) => a.id === "heap");

    expect(isHiddenBossVisible(state, areas)).toBe(false);

    state = setStatus(state, heapArea.boss.id, "cleared");
    expect(isHiddenBossVisible(state, areas)).toBe(true);
  });

  it("enforces the died-then-re-solve date rule", () => {
    const today = "2026-10-24";
    const yesterday = "2026-10-23";
    const tomorrow = "2026-10-25";

    // Died today: can NOT re-solve today (needsResolve is false)
    const diedToday = { status: "died", diedOn: today, clearedOn: null };
    expect(needsResolve(diedToday, today)).toBe(false);

    // Died yesterday: CAN re-solve today (needsResolve is true)
    const diedYesterday = { status: "died", diedOn: yesterday, clearedOn: null };
    expect(needsResolve(diedYesterday, today)).toBe(true);

    // Status is cleared or untouched: needsResolve is false
    const cleared = { status: "cleared", diedOn: yesterday, clearedOn: today };
    expect(needsResolve(cleared, today)).toBe(false);

    const untouched = { status: "untouched", diedOn: null, clearedOn: null };
    expect(needsResolve(untouched, today)).toBe(false);
  });
});
