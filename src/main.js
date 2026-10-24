import { areas, sideQuest } from './data/problems.js';
import { leetcodeUrl } from './lib/links.js';

console.log('--- DSA Souls: Setup & Data Verification ---');
console.log(`Total Areas: ${areas.length}`);

areas.forEach((area) => {
  console.log(
    `Area ${area.order}: ${area.name} | Easy: ${area.easy.length}, Medium: ${area.medium.length}, Boss: ${area.boss ? 1 : 0} (${area.boss.title})`
  );
});

console.log(`Side Quest: ${sideQuest.name}`);
console.log(
  `Warmup: ${sideQuest.warmup.length}, Medium: ${sideQuest.medium.length}, MiniBoss: ${sideQuest.miniBoss.title}, HiddenBoss: ${sideQuest.hiddenBoss.title}`
);

const app = document.getElementById('app');
if (app) {
  app.textContent = 'DSA Souls: Setup and data loaded. Check console for details.';
}
