import { areas } from '../data/problems.js';
import { loadProgress } from '../state/progress.js';
import { exportNotesAsMarkdown } from '../lib/exportNotes.js';

export function renderNotesView(container) {
  const state = loadProgress();
  const notes = state.notes || {};

  const areasWithNotes = areas.filter(
    (area) => notes[area.id] && notes[area.id].trim().length > 0
  );

  let notesContentHtml = '';

  if (areasWithNotes.length === 0) {
    notesContentHtml = `
      <div class="notes-empty-state">
        <div class="empty-icon">📜</div>
        <h3>No Bonfire Notes Recorded Yet</h3>
        <p>After fighting area bosses, record your cue, template, common bug, and lessons at the bottom of the area page.</p>
        <a href="#/" class="action-btn-link">Go to Map</a>
      </div>
    `;
  } else {
    notesContentHtml = areasWithNotes
      .map((area) => {
        const text = notes[area.id].trim();
        return `
          <article class="note-card">
            <header class="note-card-header">
              <span class="note-area-tag">Area ${area.order}</span>
              <h2 class="note-area-name">${area.name}</h2>
            </header>
            <div class="note-body">
              <pre class="note-text-content"></pre>
            </div>
          </article>
        `;
      })
      .join('');
  }

  container.innerHTML = `
    <div class="notes-view">
      <header class="notes-view-header">
        <div>
          <h1 class="notes-title">Bonfire Notes</h1>
          <p class="notes-subtitle">Distilled battle lessons from conquered patterns.</p>
        </div>
        ${
          areasWithNotes.length > 0
            ? `<button type="button" id="btn-download-notes" class="btn-download">
                 <span>📥</span> Download as Markdown
               </button>`
            : ''
        }
      </header>

      <div class="notes-list">
        ${notesContentHtml}
      </div>
    </div>
  `;

  // Safely populate text content via textContent to avoid XSS / raw injection
  if (areasWithNotes.length > 0) {
    const textEls = container.querySelectorAll('.note-text-content');
    areasWithNotes.forEach((area, index) => {
      if (textEls[index]) {
        textEls[index].textContent = notes[area.id].trim();
      }
    });

    // Download button event listener
    const downloadBtn = container.querySelector('#btn-download-notes');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        const markdown = exportNotesAsMarkdown(state, areas);
        const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'dsa-souls-notes.md';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    }
  }
}
