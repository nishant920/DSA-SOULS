import './styles/theme.css';
import { Router } from './router.js';
import { renderMapView } from './views/map.js';
import { renderAreaView } from './views/area.js';
import { renderSideQuestView } from './views/sideQuest.js';
import { renderNotesView } from './views/notes.js';
import { renderNotFoundView } from './views/notFound.js';

const app = document.getElementById('app');

if (app) {
  app.innerHTML = `
    <header class="site-header">
      <div class="header-container">
        <a href="#/" class="site-title">
          <span>⚔️</span> DSA Souls
        </a>
        <nav class="site-nav">
          <a href="#/" class="nav-link">Map</a>
          <a href="#/notes" class="nav-link">Notes</a>
        </nav>
      </div>
    </header>
    <main id="view" class="site-main" role="main"></main>
  `;
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
