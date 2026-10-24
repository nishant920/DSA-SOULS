import { areas, sideQuest } from '../data/problems.js';
import { loadProgress, saveProgress, setStatus } from '../state/progress.js';
import { isSideQuestUnlocked, isHiddenBossVisible, needsResolve } from '../lib/unlock.js';
import { leetcodeUrl } from '../lib/links.js';

function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

export function renderSideQuestView(container, params, triggerDiedBanner = false) {
  let state = loadProgress();

  // If locked, redirect to map
  if (!isSideQuestUnlocked(state, areas, sideQuest)) {
    window.location.hash = '#/';
    return;
  }

  const today = getTodayString();
  const hiddenBossUnlocked = isHiddenBossVisible(state, areas);

  function renderProblemRow(problem, isWarmup = false, isBoss = false, isHidden = false) {
    const probState = state.problems[problem.id] || { status: 'untouched', diedOn: null, clearedOn: null };
    const status = probState.status;

    const isDied = status === 'died';
    const isCleared = status === 'cleared';
    const isSkipped = status === 'skipped';
    const readyToResolve = isDied && needsResolve(probState, today);

    // In Hidden Boss ("Nameless King"), reading solutions / deaths have no penalty according to rules
    const disableCleared = !isHidden && isDied && !readyToResolve;

    let badgeHtml = '';
    if (isCleared) {
      badgeHtml = `<span class="prob-badge badge-cleared">${isBoss ? 'Trial Bested' : 'Cleared'}</span>`;
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
      <div class="problem-row status-${status} ${isBoss ? 'problem-row-boss' : ''} ${isHidden ? 'problem-row-hidden' : ''}" data-problem-id="${problem.id}">
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
            isWarmup
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

  const youDiedBanner = triggerDiedBanner
    ? `
      <div id="you-died-overlay" class="you-died-overlay" role="alert">
        <h1 class="you-died-text">YOU DIED</h1>
      </div>
    `
    : '';

  container.innerHTML = `
    ${youDiedBanner}
    <div class="area-detail-view side-quest-view-detail">
      <nav class="area-breadcrumbs">
        <a href="#/" class="back-link">← Return to Map</a>
      </nav>

      <header class="area-view-header side-quest-header">
        <div class="area-tag">Secret Area • Side Quest</div>
        <h1 class="area-view-title">${sideQuest.name}</h1>
        
        <div class="sq-key-idea-box">
          <span class="sq-dragon-icon">🐉</span>
          <p class="sq-key-idea-text">
            <strong>Key Insight:</strong> <em>"${sideQuest.keyIdea}"</em>
            <br>
            <span class="sq-key-sub">Most of these problems are that one single fact in disguise.</span>
          </p>
        </div>
      </header>

      <!-- Group 1: The Climb -->
      <section class="tier-section">
        <div class="tier-header">
          <h2>The Climb (Warm-up)</h2>
          <span class="tier-meta">Mastering basic BST invariants and recursions.</span>
        </div>
        <div class="problem-list">
          ${sideQuest.warmup.map((p) => renderProblemRow(p, true, false, false)).join('')}
        </div>
      </section>

      <!-- Group 2: The Dragons -->
      <section class="tier-section">
        <div class="tier-header">
          <h2>The Dragons (Medium)</h2>
          <span class="tier-meta">Inorder orderings, k-th elements, and BST mutation.</span>
        </div>
        <div class="problem-list">
          ${sideQuest.medium.map((p) => renderProblemRow(p, false, false, false)).join('')}
        </div>
      </section>

      <!-- Group 3: Mini-Boss -->
      <section class="tier-section">
        <div class="tier-header">
          <h2>Mini-Boss</h2>
          <span class="tier-meta">Recover BST (99). The follow-up challenge asks for O(1) space via Morris traversal.</span>
        </div>
        <div class="problem-list">
          ${renderProblemRow(sideQuest.miniBoss, false, true, false)}
        </div>
      </section>

      <!-- Group 4: Hidden Boss (The Nameless King) -->
      <section class="tier-section hidden-boss-tier">
        <div class="tier-header">
          <div class="hidden-boss-title-row">
            <h2>Hidden Boss: The Nameless King</h2>
            <span class="hidden-boss-tag">Optional Ultimate Trial</span>
          </div>
          <div class="nameless-rules-banner">
            <span class="rules-badge">Dragon Rules</span>
            <p>Doesn't count toward main progress. No time pressure. Reading the solution is not a failure.</p>
          </div>
        </div>

        ${
          hiddenBossUnlocked
            ? `<div class="problem-list">
                 ${renderProblemRow(sideQuest.hiddenBoss, false, true, true)}
               </div>`
            : `<div class="nameless-king-altar-locked">
                 <div class="storm-clouds-icon">⚡🌪️</div>
                 <h3>A Fierce Storm Gathers</h3>
                 <p>The Nameless King only reveals himself once Area 8 Boss (Find Median from Data Stream) is conquered.</p>
               </div>`
        }
      </section>
    </div>
  `;

  // Clean up YOU DIED overlay if active
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

    const row = btn.closest('[data-problem-id]');
    if (!row) return;

    const problemId = row.dataset.problemId;
    const action = btn.dataset.action;

    state = setStatus(state, problemId, action);
    saveProgress(state);

    const isDiedAction = action === 'died';
    renderSideQuestView(container, params, isDiedAction);
  };
}
