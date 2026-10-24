import { areas, sideQuest } from '../data/problems.js';
import { loadProgress, saveProgress, setBonfireDone } from '../state/progress.js';
import { isAreaUnlocked, areaProgress, isSideQuestUnlocked } from '../lib/unlock.js';
import { pickBonfireProblem } from '../lib/bonfire.js';
import { leetcodeUrl } from '../lib/links.js';

let mapPickedBonfireMap = {};

export function renderMapView(container) {
  let state = loadProgress();

  const areaNodesHtml = areas
    .map((area, idx) => {
      const unlocked = isAreaUnlocked(state, areas, area.id);
      const { done, total } = areaProgress(state, area);
      const isConquered = area.boss && state.problems[area.boss.id]?.status === 'cleared';
      const isBossSkipped = Boolean(state.bossSkipped[area.id]);
      const isBossFinished = isConquered || isBossSkipped;

      let status = 'locked';
      let statusLabel = 'Locked';

      if (unlocked) {
        if (isConquered) {
          status = 'conquered';
          statusLabel = 'Conquered';
        } else if (isBossSkipped) {
          status = 'moved-on';
          statusLabel = 'Moved On';
        } else if (done > 0) {
          status = 'in-progress';
          statusLabel = 'In Progress';
        } else {
          status = 'available';
          statusLabel = 'Available';
        }
      }

      const percent = total > 0 ? Math.round((done / total) * 100) : 0;
      const isClickable = unlocked;
      const cardTag = isClickable ? 'a' : 'div';
      const hrefAttr = isClickable ? `href="#/area/${area.id}"` : '';

      // Bonfire Revision for Areas > 1 when boss is cleared or skipped
      const previousArea = idx > 0 ? areas[idx - 1] : null;
      const isBonfireRested = Boolean(state.bonfireDone?.[area.id]);
      let bonfireMapHtml = '';

      if (isBossFinished && previousArea) {
        const picked = mapPickedBonfireMap[area.id];
        bonfireMapHtml = `
          <div class="map-bonfire-snippet ${isBonfireRested ? 'bonfire-rested' : ''}" data-area-id="${area.id}">
            <div class="map-bonfire-header">
              <span class="bonfire-flame-icon">🔥</span>
              <span class="bonfire-text">Bonfire Revision (${previousArea.name})</span>
              <span class="bonfire-status-badge ${isBonfireRested ? 'badge-rested' : 'badge-unlit'}">
                ${isBonfireRested ? 'Rested' : 'Unlit'}
              </span>
            </div>
            ${
              picked
                ? `<div class="map-bonfire-picked">
                     <span>#${picked.number} ${picked.title}</span>
                     <a href="${leetcodeUrl(picked.slug)}" target="_blank" rel="noopener noreferrer" class="lc-link">Solve ↗</a>
                   </div>`
                : ''
            }
            <div class="map-bonfire-btns">
              <button type="button" class="action-btn" data-action="map-pick-bonfire">Pick Problem</button>
              <button type="button" class="action-btn ${isBonfireRested ? 'btn-clear active' : ''}" data-action="map-toggle-rest">
                ${isBonfireRested ? 'Rested ✓' : 'Rest at Bonfire'}
              </button>
            </div>
          </div>
        `;
      }

      return `
        <li class="map-node-wrapper">
          <${cardTag} ${hrefAttr} class="area-card area-${status}" ${isClickable ? '' : 'aria-disabled="true"'}>
            <div class="area-card-header">
              <span class="area-order">Area ${area.order}</span>
              <span class="area-badge badge-${status}">${statusLabel}</span>
            </div>
            
            <h3 class="area-name">${area.name}</h3>
            <p class="area-cue">"${area.cue}"</p>

            <div class="area-progress-section">
              <div class="progress-bar-track">
                <div class="progress-bar-fill" style="width: ${percent}%;"></div>
              </div>
              <div class="progress-label">
                <span>${done} / ${total} cleared</span>
                <span>${percent}%</span>
              </div>
            </div>
          </${cardTag}>
          ${bonfireMapHtml}
        </li>
      `;
    })
    .join('');

  // Side quest branch unlock state
  const sideQuestUnlocked = isSideQuestUnlocked(state, areas, sideQuest);
  
  // Independent side quest progress calculation
  const sideQuestProblems = [
    ...sideQuest.warmup,
    ...sideQuest.medium,
    sideQuest.miniBoss,
    sideQuest.hiddenBoss
  ];
  const sqTotal = sideQuestProblems.length;
  const sqDone = sideQuestProblems.filter((p) => {
    const status = state.problems[p.id]?.status;
    return status === 'cleared' || status === 'skipped';
  }).length;
  const sqPercent = Math.round((sqDone / sqTotal) * 100);

  const sqTag = sideQuestUnlocked ? 'a' : 'div';
  const sqHref = sideQuestUnlocked ? 'href="#/side-quest"' : '';

  const sideQuestBranchHtml = `
    <div class="side-quest-wrapper">
      <div class="side-branch-connector"></div>
      <${sqTag} ${sqHref} class="side-quest-card ${sideQuestUnlocked ? 'sq-unlocked' : 'sq-locked'}" ${sideQuestUnlocked ? '' : 'aria-disabled="true"'}>
        <div class="sq-card-header">
          <span class="sq-badge-tag">🐉 Secret Area</span>
          <span class="area-badge ${sideQuestUnlocked ? 'badge-available' : 'badge-locked'}">
            ${sideQuestUnlocked ? (sqDone === sqTotal ? 'Conquered' : 'Unlocked') : 'Locked'}
          </span>
        </div>
        <h3 class="sq-title">${sideQuest.name}</h3>
        <p class="sq-desc">Optional BST Mastery Side Quest. Unlocks after conquering Area 7 (Trees).</p>
        <div class="area-progress-section">
          <div class="progress-bar-track">
            <div class="progress-bar-fill sq-progress-fill" style="width: ${sqPercent}%;"></div>
          </div>
          <div class="progress-label">
            <span>${sqDone} / ${sqTotal} trials</span>
            <span>${sqPercent}%</span>
          </div>
        </div>
      </${sqTag}>
    </div>
  `;

  container.innerHTML = `
    <div class="map-view">
      <header class="map-header">
        <h1 class="map-title">The Journey</h1>
        <p class="map-subtitle">Conquer each realm to unlock the next. Defeat the bosses or forge onwards.</p>
      </header>

      <ol class="map-path">
        ${areaNodesHtml}
      </ol>

      <!-- Side Quest Branch -->
      <section id="side-quest-branch" class="side-quest-branch-section" aria-label="Side Quest Branch">
        <div class="side-quest-divider">
          <span>Branch Path</span>
        </div>
        ${sideQuestBranchHtml}
      </section>
    </div>
  `;

  // Event delegation on container for map bonfire actions
  container.onclick = (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;

    const action = btn.dataset.action;
    const snippet = btn.closest('[data-area-id]');
    if (!snippet) return;

    const areaId = snippet.dataset.areaId;
    const areaIdx = areas.findIndex((a) => a.id === areaId);
    const previousArea = areaIdx > 0 ? areas[areaIdx - 1] : null;

    if (action === 'map-pick-bonfire') {
      const picked = pickBonfireProblem(state, previousArea);
      if (!picked) {
        alert(`No cleared problems found in ${previousArea.name} to revise.`);
      } else {
        mapPickedBonfireMap[areaId] = picked;
      }
      renderMapView(container);
      return;
    }

    if (action === 'map-toggle-rest') {
      const currentRested = Boolean(state.bonfireDone?.[areaId]);
      state = setBonfireDone(state, areaId, !currentRested);
      saveProgress(state);
      renderMapView(container);
    }
  };
}
