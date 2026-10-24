/**
 * Pure validation for imported DSA Souls progress JSON data.
 *
 * @param {unknown} data - Parsed JSON object to validate
 * @returns {{ valid: boolean, state?: Object, error?: string }}
 */
export function validateProgressData(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return { valid: false, error: "Import file must be a valid JSON object." };
  }

  // Version check
  if (data.version === undefined || data.version === null) {
    return { valid: false, error: "Missing required 'version' field." };
  }

  // Check top-level objects
  if (!data.problems || typeof data.problems !== "object" || Array.isArray(data.problems)) {
    return { valid: false, error: "Missing or invalid 'problems' map." };
  }

  if (!data.notes || typeof data.notes !== "object" || Array.isArray(data.notes)) {
    return { valid: false, error: "Missing or invalid 'notes' map." };
  }

  if (!data.bossSkipped || typeof data.bossSkipped !== "object" || Array.isArray(data.bossSkipped)) {
    return { valid: false, error: "Missing or invalid 'bossSkipped' map." };
  }

  // Validate problems map
  const validStatuses = new Set(["untouched", "cleared", "died", "skipped"]);
  for (const [probId, probObj] of Object.entries(data.problems)) {
    if (!probObj || typeof probObj !== "object" || Array.isArray(probObj)) {
      return { valid: false, error: `Invalid problem entry for key '${probId}'.` };
    }
    if (!validStatuses.has(probObj.status)) {
      return { valid: false, error: `Invalid status '${probObj.status}' for problem '${probId}'.` };
    }
  }

  // Validate notes map
  for (const [areaId, noteText] of Object.entries(data.notes)) {
    if (typeof noteText !== "string") {
      return { valid: false, error: `Note for area '${areaId}' must be a string.` };
    }
  }

  // Validate bossSkipped map
  for (const [areaId, skippedVal] of Object.entries(data.bossSkipped)) {
    if (typeof skippedVal !== "boolean") {
      return { valid: false, error: `Boss skipped value for area '${areaId}' must be a boolean.` };
    }
  }

  // Return clean state object
  const cleanState = {
    problems: { ...data.problems },
    notes: { ...data.notes },
    bossSkipped: { ...data.bossSkipped }
  };

  return { valid: true, state: cleanState };
}
