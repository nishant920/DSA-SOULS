export function renderAreaView(container, params) {
  const areaId = params?.id || 'unknown';
  container.innerHTML = `
    <div class="view-placeholder">
      <h2>Area View: ${areaId}</h2>
      <p>Enemies, boss encounter, and bonfire for this area will appear here.</p>
    </div>
  `;
}
