import { areas } from '../data/problems.js';
import { loadProgress, saveProgress } from '../state/progress.js';
import { exportNotesAsMarkdown } from '../lib/exportNotes.js';
import { validateProgressData } from '../lib/validate.js';

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
      <!-- Backup & Restore section -->
      <section class="progress-backup-panel">
        <div class="backup-info">
          <h3>Progress & Save Data</h3>
          <p>Export your journey to a backup file, or restore progress on another device.</p>
        </div>
        <div class="backup-actions">
          <button type="button" id="btn-export-progress" class="backup-btn">
            <span>💾</span> Export Progress
          </button>
          <label for="import-file-input" class="backup-btn backup-btn-import">
            <span>📂</span> Import Progress
          </label>
          <input type="file" id="import-file-input" class="hidden-file-input" accept=".json" />
        </div>
        <div id="import-error-banner" class="import-error-banner" style="display: none;" role="alert"></div>
      </section>

      <header class="notes-view-header">
        <div>
          <h1 class="notes-title">Bonfire Notes</h1>
          <p class="notes-subtitle">Distilled battle lessons from conquered patterns.</p>
        </div>
        ${
          areasWithNotes.length > 0
            ? `<button type="button" id="btn-download-notes" class="btn-download">
                 <span>📥</span> Download Notes (.md)
               </button>`
            : ''
        }
      </header>

      <div class="notes-list">
        ${notesContentHtml}
      </div>
    </div>
  `;

  // Safely populate text content via textContent to avoid raw markup injection
  if (areasWithNotes.length > 0) {
    const textEls = container.querySelectorAll('.note-text-content');
    areasWithNotes.forEach((area, index) => {
      if (textEls[index]) {
        textEls[index].textContent = notes[area.id].trim();
      }
    });

    // Download notes markdown button
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

  // Export progress button
  const exportProgressBtn = container.querySelector('#btn-export-progress');
  if (exportProgressBtn) {
    exportProgressBtn.addEventListener('click', () => {
      const exportPayload = {
        version: 1,
        exportedAt: new Date().toISOString(),
        problems: state.problems || {},
        notes: state.notes || {},
        bossSkipped: state.bossSkipped || {}
      };

      const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
        type: 'application/json;charset=utf-8'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'dsa-souls-progress.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  // Import progress file input
  const importInput = container.querySelector('#import-file-input');
  const errorBanner = container.querySelector('#import-error-banner');

  if (importInput && errorBanner) {
    importInput.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const rawText = event.target?.result;
          if (typeof rawText !== 'string') {
            throw new Error('Unable to read file content.');
          }

          const parsed = JSON.parse(rawText);
          const validation = validateProgressData(parsed);

          if (!validation.valid) {
            errorBanner.textContent = `Import Failed: ${validation.error}`;
            errorBanner.style.display = 'block';
            importInput.value = '';
            return;
          }

          errorBanner.style.display = 'none';

          const confirmed = window.confirm(
            'Overwrite current progress with this backup file? This will replace your current state.'
          );

          if (confirmed) {
            saveProgress(validation.state);
            renderNotesView(container);
          } else {
            importInput.value = '';
          }
        } catch (err) {
          errorBanner.textContent = `Import Error: ${err.message || 'Invalid JSON file.'}`;
          errorBanner.style.display = 'block';
          importInput.value = '';
        }
      };

      reader.onerror = () => {
        errorBanner.textContent = 'Failed to read the selected file.';
        errorBanner.style.display = 'block';
        importInput.value = '';
      };

      reader.readAsText(file);
    });
  }
}
