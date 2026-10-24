/**
 * Pure game logic and unlock rules.
 * No DOM access or localStorage access.
 */

/**
 * Checks if a problem is considered done (cleared or skipped).
 */
export function isDone(state, problemId) {
  const prob = state.problems[problemId];
  if (!prob) return false;
  return prob.status === "cleared" || prob.status === "skipped";
}

/**
 * Returns total and done counts for an area (easy + medium + boss).
 */
export function areaProgress(state, area) {
  const problems = [...(area.easy || []), ...(area.medium || [])];
  if (area.boss) {
    problems.push(area.boss);
  }

  const total = problems.length;
  const done = problems.filter((p) => isDone(state, p.id)).length;

  return { done, total };
}

/**
 * Boss is unlocked only when all mediums in that area are cleared.
 */
export function isBossUnlocked(state, area) {
  if (!area.medium || area.medium.length === 0) return true;
  return area.medium.every((p) => state.problems[p.id]?.status === "cleared");
}

/**
 * Checks if an area is unlocked.
 * - Area 1 is always unlocked.
 * - Area N+1 unlocks when Area N boss is cleared OR bossSkipped[N] is true.
 */
export function isAreaUnlocked(state, areas, areaId) {
  const targetIndex = areas.findIndex((a) => a.id === areaId);
  if (targetIndex <= 0) return true; // Area 1 (index 0) or not found default to unlocked if first

  const prevArea = areas[targetIndex - 1];
  const bossId = prevArea.boss?.id;
  const isBossCleared = bossId ? state.problems[bossId]?.status === "cleared" : false;
  const isSkipped = Boolean(state.bossSkipped[prevArea.id]);

  return isBossCleared || isSkipped;
}

/**
 * Side quest (Archdragon Peak) unlocks when "trees" area has:
 * - All easies done (cleared or skipped)
 * - All mediums cleared
 * - Boss cleared or bossSkipped
 */
export function isSideQuestUnlocked(state, areas, sideQuest) {
  const treesArea = areas.find((a) => a.id === (sideQuest.unlocksAfterArea || "trees"));
  if (!treesArea) return false;

  const easiesDone = treesArea.easy.every((p) => isDone(state, p.id));
  const mediumsCleared = treesArea.medium.every((p) => state.problems[p.id]?.status === "cleared");
  const bossCleared = treesArea.boss ? state.problems[treesArea.boss.id]?.status === "cleared" : true;
  const bossSkipped = Boolean(state.bossSkipped[treesArea.id]);

  return easiesDone && mediumsCleared && (bossCleared || bossSkipped);
}

/**
 * Hidden boss is visible only when Area 8 boss is cleared.
 */
export function isHiddenBossVisible(state, areas) {
  const area8 = areas.find((a) => a.order === 8) || areas[7];
  if (!area8 || !area8.boss) return false;
  return state.problems[area8.boss.id]?.status === "cleared";
}

/**
 * Needs resolve rule:
 * True if status is "died" and diedOn is strictly before today (YYYY-MM-DD strings compared lexicographically).
 * A problem that died today cannot be re-solved until a later day.
 */
export function needsResolve(probState, today) {
  if (!probState) return false;
  if (probState.status !== "died") return false;
  if (!probState.diedOn) return true;
  return probState.diedOn < today;
}
