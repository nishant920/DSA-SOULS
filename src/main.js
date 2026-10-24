import './styles/theme.css';
import { Router } from './router.js';
import { isStorageAvailable } from './state/progress.js';
import { renderMapView } from './views/map.js';
import { renderAreaView } from './views/area.js';
import { renderSideQuestView } from './views/sideQuest.js';
import { renderNotesView } from './views/notes.js';
import { renderNotFoundView } from './views/notFound.js';

const app = document.getElementById('app');

const storageAvailable = isStorageAvailable();
const storageWarningHtml = !storageAvailable
  ? `
    <div id="storage-warning" class="storage-warning-bar" role="alert" aria-live="polite">
      <span>⚠️ Warning: LocalStorage is blocked or unavailable. Progress will not be saved after closing this tab.</span>
      <button type="button" id="dismiss-storage-warning" class="btn-dismiss-warning" aria-label="Dismiss warning">✕</button>
    </div>
  `
  : '';

if (app) {
  app.innerHTML = `
    ${storageWarningHtml}
    <header class="site-header">
      <div class="header-container">
        <a href="#/" class="site-title" aria-label="DSA Souls Home">
          <span aria-hidden="true">⚔️</span> DSA Souls
        </a>
        <nav class="site-nav" aria-label="Main Navigation">
          <a href="#/" class="nav-link">Map</a>
          <a href="#/notes" class="nav-link">Notes</a>
        </nav>
      </div>
    </header>
    <main id="view" class="site-main" role="main"></main>
  `;

  const dismissBtn = document.getElementById('dismiss-storage-warning');
  if (dismissBtn) {
    dismissBtn.addEventListener('click', () => {
      document.getElementById('storage-warning')?.remove();
    });
  }
}

const routes = [
  { pattern: '/', render: renderMapView },
  { pattern: '/area/:id', render: renderAreaView },
  { pattern: '/side-quest', render: renderSideQuestView },
  { pattern: '/notes', render: renderNotesView },
  { pattern: '*', render: renderNotFoundView }
];

export const router = new Router(routes, 'view');
router.resolve();
