import { areas } from '../data/problems.js';
import { loadProgress, saveProgress, setStatus, setBossSkipped, setNote, setBonfireDone } from '../state/progress.js';
import { isAreaUnlocked, isBossUnlocked, needsResolve } from '../lib/unlock.js';
import { pickBonfireProblem } from '../lib/bonfire.js';
import { leetcodeUrl } from '../lib/links.js';

function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

let debounceTimer = null;
let currentPickedProblem = null;

export function renderAreaView(container, params, triggerDiedBanner = false) {
  const areaId = params?.id;
  const areaIndex = areas.findIndex((a) => a.id === areaId);
  const area = areas[areaIndex];

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
  const isBossCleared = area.boss && state.problems[area.boss.id]?.status === 'cleared';
  const isBossSkipped = Boolean(state.bossSkipped[area.id]);
  const isBossFinished = isBossCleared || isBossSkipped;
  const currentNote = state.notes[area.id] || '';

  // Bonfire checks (available for areas > 1 after boss is conquered or moved on)
  const previousArea = areaIndex > 0 ? areas[areaIndex - 1] : null;
  const isBonfireRested = Boolean(state.bonfireDone?.[area.id]);

  function renderProblemRow(problem, isEasy = false, isBoss = false) {
    const probState = state.problems[problem.id] || { status: 'untouched', diedOn: null, clearedOn: null };
    const status = probState.status;

    const isDied = status === 'died';
    const isCleared = status === 'cleared';
    const isSkipped = status === 'skipped';
    const readyToResolve = isDied && needsResolve(probState, today);

    const disableCleared = isDied && !readyToResolve;

    let badgeHtml = '';
    if (isCleared) {
      badgeHtml = `<span class="prob-badge badge-cleared">${isBoss ? 'Boss Defeated' : 'Cleared'}</span>`;
    } else if (isSkipped) {
      badgeHtml = `<span class="prob-badge badge-skipped">Skipped</span>`;
    } else if (isBoss && isBossSkipped) {
      badgeHtml = `<span class="prob-badge badge-moved-on">Moved On</span>`;
    } else if (isDied) {
      if (readyToResolve) {
        badgeHtml = `<span class="prob-badge badge-ready">Ready to re-solve</span>`;
      } else {
        badgeHtml = `<span class="prob-badge badge-died">Re-solve tomorrow</span>`;
      }
    }

    let moveOnControl = '';
    if (isBoss) {
      moveOnControl = `
        <div class="boss-move-on-container">
          <button 
            type="button" 
            class="action-btn btn-move-on ${isBossSkipped ? 'active' : ''}" 
            data-action="toggle-move-on"
          >
            ${isBossSkipped ? 'Boss Skipped (Moved On)' : 'Move on (boss defeated me)'}
          </button>
          <span class="move-on-note">"Read the solution, write it in your notes, and move on."</span>
        </div>
      `;
    }

    return `
      <div class="problem-row status-${status} ${isBoss ? 'problem-row-boss' : ''}" data-problem-id="${problem.id}">
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

        ${moveOnControl}
      </div>
    `;
  }

  const bossDefeatedBanner = isBossCleared
    ? `
      <div class="banner-boss-defeated" role="status">
        <div class="banner-spark">✦</div>
        <h2>BOSS DEFEATED</h2>
        <div class="banner-spark">✦</div>
      </div>
    `
    : '';

  const youDiedBanner = triggerDiedBanner
    ? `
      <div id="you-died-overlay" class="you-died-overlay" role="alert">
        <h1 class="you-died-text">YOU DIED</h1>
      </div>
    `
    : '';

  // Bonfire card rendering
  let bonfireCardHtml = '';
  if (isBossFinished && previousArea) {
    let pickDetailsHtml = '';
    if (currentPickedProblem) {
      pickDetailsHtml = `
        <div class="bonfire-picked-card">
          <span class="bonfire-picked-label">Selected for Revision (${previousArea.name}):</span>
          <div class="bonfire-problem-info">
            <strong>#${currentPickedProblem.number} ${currentPickedProblem.title}</strong>
            <a href="${leetcodeUrl(currentPickedProblem.slug)}" target="_blank" rel="noopener noreferrer" class="lc-link">
              Open on LeetCode ↗
            </a>
          </div>
        </div>
      `;
    }

    bonfireCardHtml = `
      <section class="bonfire-card ${isBonfireRested ? 'bonfire-rested' : ''}">
        <div class="bonfire-card-header">
          <div class="bonfire-title-group">
            <span class="bonfire-flame-icon">🔥</span>
            <div>
              <h3>Bonfire: Revision Checkpoint</h3>
              <p class="bonfire-desc">"Redo one random problem from the previous area before moving on."</p>
            </div>
          </div>
          <span class="bonfire-status-badge ${isBonfireRested ? 'badge-rested' : 'badge-unlit'}">
            ${isBonfireRested ? 'Bonfire Kindled (Rested)' : 'Unlit Bonfire'}
          </span>
        </div>

        ${pickDetailsHtml}

        <div class="bonfire-actions">
          <button type="button" class="bonfire-btn btn-pick-problem" data-action="pick-bonfire">
            <span>🎲</span> Pick my problem
          </button>
          <button type="button" class="bonfire-btn btn-rest-bonfire ${isBonfireRested ? 'active' : ''}" data-action="toggle-rest">
            <span>🛡️</span> ${isBonfireRested ? 'Rested (Click to rekindle)' : 'Done, I rested at the bonfire'}
          </button>
        </div>
      </section>
    `;
  }

  const notesPlaceholder = `1. The Cue: 
2. The Template: 
3. The Common Bug: 
4. Best Lesson (Problem that taught the most):`;

  container.innerHTML = `
    ${youDiedBanner}
    <div class="area-detail-view">
      <nav class="area-breadcrumbs">
        <a href="#/" class="back-link">← Return to Map</a>
      </nav>

      ${bossDefeatedBanner}

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

      ${bonfireCardHtml}

      <!-- Easy Tier -->
      <section class="tier-section">
        <div class="tier-header">
          <h2>Basic Enemies (Easy)</h2>
          <span class="tier-meta">Learn the area pattern. Skip rule: under 10m on first 2 skips remaining.</span>
        </div>
        <div class="problem-list" data-tier="easy">
          ${area.easy.map((p) => renderProblemRow(p, true, false)).join('')}
        </div>
      </section>

      <!-- Medium Tier -->
      <section class="tier-section">
        <div class="tier-header">
          <h2>Side Quests & Levelling Up (Medium)</h2>
          <span class="tier-meta">Clear all mediums without help to open the boss gate.</span>
        </div>
        <div class="problem-list" data-tier="medium">
          ${area.medium.map((p) => renderProblemRow(p, false, false)).join('')}
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
                 ${renderProblemRow(area.boss, false, true)}
               </div>`
            : `<div class="boss-gate-locked">
                 <div class="fog-gate-icon">🌫️</div>
                 <h3>Traversed by Fog</h3>
                 <p>Clear all mediums to face the boss.</p>
               </div>`
        }
      </section>

      <!-- Area Bonfire Notes Section -->
      <section class="area-notes-section">
        <div class="notes-header">
          <h2>Bonfire Notes (Area ${area.order})</h2>
          <span id="notes-status-badge" class="notes-status-badge">Auto-saved</span>
        </div>
        <p class="notes-hint">
          After conquering or moving on from the boss, write down your key learnings:
        </p>
        <textarea 
          id="area-notes-input" 
          class="notes-textarea" 
          rows="6" 
          placeholder="${notesPlaceholder}"
          aria-label="Area battle notes"
        ></textarea>
      </section>
    </div>
  `;

  // Safely populate textarea value
  const textarea = container.querySelector('#area-notes-input');
  if (textarea) {
    textarea.value = currentNote;

    textarea.addEventListener('input', (e) => {
      const badge = container.querySelector('#notes-status-badge');
      if (badge) badge.textContent = 'Saving...';

      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const text = e.target.value;
        state = setNote(state, area.id, text);
        saveProgress(state);
        if (badge) {
          badge.textContent = 'Saved';
          setTimeout(() => {
            if (badge) badge.textContent = 'Auto-saved';
          }, 1500);
        }
      }, 400);
    });
  }

  // Clear YOU DIED banner if rendered
  if (triggerDiedBanner) {
    const overlay = document.getElementById('you-died-overlay');
    if (overlay) {
      setTimeout(() => {
        if (overlay && overlay.parentNode) {
          overlay.remove();
        }
      }, 3000);
    }
  }

  // Event delegation on container
  container.onclick = (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn || btn.disabled) return;

    const action = btn.dataset.action;

    // Bonfire Actions
    if (action === 'pick-bonfire') {
      const picked = pickBonfireProblem(state, previousArea);
      if (!picked) {
        alert(`No cleared problems found in ${previousArea.name} to revise.`);
      } else {
        currentPickedProblem = picked;
      }
      renderAreaView(container, params, false);
      return;
    }

    if (action === 'toggle-rest') {
      const nextRestedState = !isBonfireRested;
      state = setBonfireDone(state, area.id, nextRestedState);
      saveProgress(state);
      renderAreaView(container, params, false);
      return;
    }

    if (action === 'toggle-move-on') {
      const nextSkippedState = !isBossSkipped;
      state = setBossSkipped(state, area.id, nextSkippedState);
      saveProgress(state);
      renderAreaView(container, params, false);
      return;
    }

    const row = btn.closest('[data-problem-id]');
    if (!row) return;

    const problemId = row.dataset.problemId;
    state = setStatus(state, problemId, action);
    saveProgress(state);

    const isDiedAction = action === 'died';
    renderAreaView(container, params, isDiedAction);
  };
}
