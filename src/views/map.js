import { areas, sideQuest } from '../data/problems.js';
import { loadProgress } from '../state/progress.js';
import { isAreaUnlocked, areaProgress, isSideQuestUnlocked } from '../lib/unlock.js';

export function renderMapView(container) {
  const state = loadProgress();

  const areaNodesHtml = areas
    .map((area) => {
      const unlocked = isAreaUnlocked(state, areas, area.id);
      const { done, total } = areaProgress(state, area);
      const isConquered = area.boss && state.problems[area.boss.id]?.status === 'cleared';
      const isBossSkipped = Boolean(state.bossSkipped[area.id]);

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
}
