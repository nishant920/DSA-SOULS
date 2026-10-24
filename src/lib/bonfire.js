/**
 * Pure selection logic for the Bonfire (revision) feature.
 *
 * @param {Object} state - Current progress state
 * @param {Object} previousArea - The area definition preceding the current area
 * @param {Function} [randomFn=Math.random] - Optional random generator for deterministic testing
 * @returns {Object|null} Selected problem or null if no cleared problems exist
 */
export function pickBonfireProblem(state, previousArea, randomFn = Math.random) {
  if (!previousArea) return null;

  const allProblems = [
    ...(previousArea.easy || []),
    ...(previousArea.medium || [])
  ];
  if (previousArea.boss) {
    allProblems.push(previousArea.boss);
  }

  const clearedProblems = allProblems.filter(
    (p) => state.problems[p.id]?.status === 'cleared'
  );

  if (clearedProblems.length === 0) {
    return null;
  }

  const index = Math.floor(randomFn() * clearedProblems.length);
  return clearedProblems[index];
}
