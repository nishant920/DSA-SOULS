/**
 * Pure function to format user's area notes into a clean Markdown string.
 *
 * @param {Object} state - Current progress state containing `notes` map
 * @param {Array} areas - List of area definitions
 * @returns {string} Formatted markdown document
 */
export function exportNotesAsMarkdown(state, areas) {
  let md = "# DSA Souls Notes\n\n";
  const notes = state.notes || {};

  const areasWithNotes = areas.filter(
    (area) => notes[area.id] && notes[area.id].trim().length > 0
  );

  if (areasWithNotes.length === 0) {
    return md + "_No notes recorded yet._\n";
  }

  areasWithNotes.forEach((area) => {
    md += `## ${area.name}\n\n${notes[area.id].trim()}\n\n`;
  });

  return md;
}
