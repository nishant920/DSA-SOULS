const STORAGE_KEY = "dsa-souls-progress-v1";

let memoryFallback = null;

export const STATUSES = Object.freeze({
  UNTOUCHED: "untouched",
  CLEARED: "cleared",
  DIED: "died",
  SKIPPED: "skipped"
});

/**
 * Checks if localStorage is available and functional
 */
export function isStorageAvailable() {
  try {
    if (typeof window === "undefined" || !window.localStorage) {
      return false;
    }
    const testKey = "__dsa_souls_test__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Returns a fresh, default state object
 */
export function getDefaultState() {
  return {
    problems: {},
    notes: {},
    bossSkipped: {},
    bonfireDone: {}
  };
}

/**
 * Safely loads state from localStorage (or in-memory fallback)
 */
export function loadProgress() {
  if (!isStorageAvailable()) {
    if (!memoryFallback) {
      memoryFallback = getDefaultState();
    }
    return memoryFallback;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultState();
    
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return getDefaultState();
    }
    
    return {
      problems: parsed.problems && typeof parsed.problems === "object" ? parsed.problems : {},
      notes: parsed.notes && typeof parsed.notes === "object" ? parsed.notes : {},
      bossSkipped: parsed.bossSkipped && typeof parsed.bossSkipped === "object" ? parsed.bossSkipped : {},
      bonfireDone: parsed.bonfireDone && typeof parsed.bonfireDone === "object" ? parsed.bonfireDone : {}
    };
  } catch {
    return getDefaultState();
  }
}

/**
 * Safely writes state to localStorage (or in-memory fallback)
 */
export function saveProgress(state) {
  if (!isStorageAvailable()) {
    memoryFallback = state;
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error("Failed to save progress to localStorage:", err);
    memoryFallback = state;
  }
}

/**
 * Pure update: sets status for a problem, updating clearedOn / diedOn timestamps
 * @returns {Object} New state object
 */
export function setStatus(state, problemId, status, dateStr = new Date().toISOString().split("T")[0]) {
  const currentProb = state.problems[problemId] || { status: STATUSES.UNTOUCHED, diedOn: null, clearedOn: null };
  
  const updatedProb = {
    ...currentProb,
    status
  };

  if (status === STATUSES.CLEARED) {
    updatedProb.clearedOn = dateStr;
  } else if (status === STATUSES.DIED) {
    updatedProb.diedOn = dateStr;
  }

  return {
    ...state,
    problems: {
      ...state.problems,
      [problemId]: updatedProb
    }
  };
}

/**
 * Pure update: sets note for an area
 * @returns {Object} New state object
 */
export function setNote(state, areaId, text) {
  return {
    ...state,
    notes: {
      ...state.notes,
      [areaId]: text
    }
  };
}

/**
 * Pure update: sets bossSkipped flag for an area
 * @returns {Object} New state object
 */
export function setBossSkipped(state, areaId, bool) {
  return {
    ...state,
    bossSkipped: {
      ...state.bossSkipped,
      [areaId]: Boolean(bool)
    }
  };
}

/**
 * Pure update: sets bonfireDone flag for an area
 * @returns {Object} New state object
 */
export function setBonfireDone(state, areaId, bool) {
  return {
    ...state,
    bonfireDone: {
      ...(state.bonfireDone || {}),
      [areaId]: Boolean(bool)
    }
  };
}
