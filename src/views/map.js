import { areas } from '../data/problems.js';
import { loadProgress } from '../state/progress.js';
import { isAreaUnlocked, areaProgress } from '../lib/unlock.js';

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

  container.innerHTML = `
    <div class="map-view">
      <header class="map-header">
        <h1 class="map-title">The Journey</h1>
        <p class="map-subtitle">Conquer each realm to unlock the next. Defeat the bosses or forge onwards.</p>
      </header>

      <ol class="map-path">
        ${areaNodesHtml}
      </ol>

      <!-- Side Quest Branch: reserved for subsequent steps -->
      <section id="side-quest-branch" class="side-quest-branch" aria-label="Side Quest Branch"></section>
    </div>
  `;
}
