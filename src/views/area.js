import { areas } from '../data/problems.js';
import { loadProgress, saveProgress, setStatus } from '../state/progress.js';
import { isAreaUnlocked, isBossUnlocked, needsResolve } from '../lib/unlock.js';
import { leetcodeUrl } from '../lib/links.js';

function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

export function renderAreaView(container, params) {
  const areaId = params?.id;
  const area = areas.find((a) => a.id === areaId);

  // If area not found, redirect to map
  if (!area) {
    window.location.hash = '#/';
    return;
  }

  let state = loadProgress();

  // If area is locked, redirect to map
  if (!isAreaUnlocked(state, areas, area.id)) {
    window.location.hash = '#/';
    return;
  }

  const today = getTodayString();
  const bossUnlocked = isBossUnlocked(state, area);

  function renderProblemRow(problem, isEasy = false) {
    const probState = state.problems[problem.id] || { status: 'untouched', diedOn: null, clearedOn: null };
    const status = probState.status;

    const isDied = status === 'died';
    const isCleared = status === 'cleared';
    const isSkipped = status === 'skipped';
    const readyToResolve = isDied && needsResolve(probState, today);
    const diedToday = isDied && probState.diedOn === today;

    // Disabled rule: if problem died today, Cleared is disabled
    const disableCleared = isDied && !readyToResolve;

    let badgeHtml = '';
    if (isCleared) {
      badgeHtml = `<span class="prob-badge badge-cleared">Cleared</span>`;
    } else if (isSkipped) {
      badgeHtml = `<span class="prob-badge badge-skipped">Skipped</span>`;
    } else if (isDied) {
      if (readyToResolve) {
        badgeHtml = `<span class="prob-badge badge-ready">Ready to re-solve</span>`;
      } else {
        badgeHtml = `<span class="prob-badge badge-died">Re-solve tomorrow</span>`;
      }
    }

    return `
      <div class="problem-row status-${status}" data-problem-id="${problem.id}">
        <div class="problem-info">
          <span class="problem-number">#${problem.number}</span>
          <span class="problem-title">${problem.title}</span>
          <a href="${leetcodeUrl(problem.slug)}" target="_blank" rel="noopener noreferrer" class="lc-link">
            Open on LeetCode ↗
          </a>
          ${badgeHtml}
        </div>

        <div class="problem-actions">
          <button 
            type="button" 
            class="action-btn btn-clear ${isCleared ? 'active' : ''}" 
            data-action="cleared" 
            ${disableCleared ? 'disabled title="Cannot clear on the same day you peeked at solution"' : ''}
          >
            Cleared
          </button>
          
          <button 
            type="button" 
            class="action-btn btn-died ${isDied ? 'active' : ''}" 
            data-action="died"
          >
            Died
          </button>

          ${
            isEasy
              ? `<button 
                   type="button" 
                   class="action-btn btn-skip ${isSkipped ? 'active' : ''}" 
                   data-action="skipped"
                 >
                   Skip
                 </button>`
              : ''
          }

          <button 
            type="button" 
            class="action-btn btn-reset" 
            data-action="untouched"
            title="Reset problem status"
          >
            Reset
          </button>
        </div>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="area-detail-view">
      <nav class="area-breadcrumbs">
        <a href="#/" class="back-link">← Return to Map</a>
      </nav>

      <header class="area-view-header">
        <div class="area-tag">Area ${area.order}</div>
        <h1 class="area-view-title">${area.name}</h1>
        <p class="area-view-cue">"${area.cue}"</p>
        <div class="area-reminder-box">
          <span class="reminder-icon">⚔️</span>
          <p class="reminder-text">
            <strong>Rule:</strong> Before you code, write: <em>"This is a ___ problem because ___."</em>
          </p>
        </div>
      </header>

      <!-- Easy Tier -->
      <section class="tier-section">
        <div class="tier-header">
          <h2>Basic Enemies (Easy)</h2>
          <span class="tier-meta">Learn the area pattern. Skip rule: under 10m on first 2 skips remaining.</span>
        </div>
        <div class="problem-list" data-tier="easy">
          ${area.easy.map((p) => renderProblemRow(p, true)).join('')}
        </div>
      </section>

      <!-- Medium Tier -->
      <section class="tier-section">
        <div class="tier-header">
          <h2>Side Quests & Levelling Up (Medium)</h2>
          <span class="tier-meta">Clear all mediums without help to open the boss gate.</span>
        </div>
        <div class="problem-list" data-tier="medium">
          ${area.medium.map((p) => renderProblemRow(p, false)).join('')}
        </div>
      </section>

      <!-- Boss Tier -->
      <section class="tier-section boss-tier">
        <div class="tier-header">
          <h2>Area Boss</h2>
          <span class="tier-meta">The ultimate trial for this pattern.</span>
        </div>
        ${
          bossUnlocked
            ? `<div class="problem-list" data-tier="boss">
                 ${renderProblemRow(area.boss, false)}
               </div>`
            : `<div class="boss-gate-locked">
                 <div class="fog-gate-icon">🌫️</div>
                 <h3>Traversed by Fog</h3>
                 <p>Clear all mediums to face the boss.</p>
               </div>`
        }
      </section>
    </div>
  `;

  // Attach event delegation for action buttons (only one listener on container)
  container.onclick = (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn || btn.disabled) return;

    const row = btn.closest('[data-problem-id]');
    if (!row) return;

    const problemId = row.dataset.problemId;
    const action = btn.dataset.action;

    state = setStatus(state, problemId, action);
    saveProgress(state);

    // Pure redraw from state
    renderAreaView(container, params);
  };
}
