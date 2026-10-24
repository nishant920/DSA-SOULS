export function renderNotFoundView(container) {
  container.innerHTML = `
    <div class="lost-view">
      <h2>Lost in the Dark</h2>
      <p>The fog is thick here. You have wandered into uncharted darkness.</p>
      <a href="#/">Return to the Bonfire (Map)</a>
    </div>
  `;
}
