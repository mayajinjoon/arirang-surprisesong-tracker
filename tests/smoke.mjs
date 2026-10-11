import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildTourModel, canonicalSongKey, isFirstAppearance, projectPoint } from '../app.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(fs.readFileSync(path.join(root, 'data/tour.json'), 'utf8'));
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const model = buildTourModel(data);

assert.match(html, /https:\/\/www\.tiktok\.com\/@mayajoonofficial/, 'TikTok profile link must be present on the opening page');
assert.match(html, /rel="noopener noreferrer"/, 'External TikTok link must not retain opener access');

assert.equal(model.shows.length, 88);
assert.equal(model.completed.length, 53);
assert.equal(model.upcoming.length, 35);
assert.equal(model.occurrencesBySong.size, 61);
assert.equal(model.upcoming[0].label, 'Santiago D1');
assert.equal(model.shows.at(-1).label, 'Bulacan D3');
assert.ok(model.upcoming.every(show => show.surpriseSongs.length === 0), 'future shows must not contain songs');

const bogota1 = model.shows.find(show => show.id === '2026-10-02-bogota-d1');
const bogota2 = model.shows.find(show => show.id === '2026-10-03-bogota-d2');
const lima1 = model.shows.find(show => show.id === '2026-10-07-lima-d1');
const lima2 = model.shows.find(show => show.id === '2026-10-09-lima-d2');
const lima3 = model.shows.find(show => show.id === '2026-10-10-lima-d3');
assert.deepEqual(bogota2.surpriseSongs.map(song => song.title), ['We Are Bulletproof Pt.2', 'Mikrokosmos']);
assert.deepEqual(lima1.surpriseSongs.map(song => song.title), ['HOME', 'Outro: Wings']);
assert.deepEqual(lima2.surpriseSongs.map(song => song.title), ['Paldogangsan', 'We Are Bulletproof: The Eternal']);
assert.deepEqual(lima3.surpriseSongs.map(song => song.title), ['House of Cards', 'UGH!']);
assert.equal(isFirstAppearance(model, bogota1.id, "I'm Fine"), true);
assert.equal(isFirstAppearance(model, bogota2.id, 'We Are Bulletproof Pt.2'), false);
assert.equal(isFirstAppearance(model, bogota2.id, 'Mikrokosmos'), false);
assert.equal(isFirstAppearance(model, lima1.id, 'HOME'), false);
assert.equal(isFirstAppearance(model, lima1.id, 'Outro: Wings'), false);
assert.equal(canonicalSongKey('  Spring   Day '), 'spring day');

for (const city of model.cities.values()) {
  const point = projectPoint(city.coordinates.latitude, city.coordinates.longitude);
  assert.ok(point.x >= 0 && point.x <= 1000 && point.y >= 0 && point.y <= 500, `map point out of bounds: ${city.city}`);
}

for (const relative of ['./styles.css','./app.js','./assets/original/maya-pop-purple.jpeg']) {
  assert.ok(html.includes(relative), `missing relative GitHub Pages path: ${relative}`);
}
assert.ok(app.includes("'./data/tour.json'"), 'dataset URL must remain relative for GitHub Pages');
assert.ok(!/(?:src|href)="\/(?!\/)/.test(html), 'root-absolute asset path breaks project-site deployment');
assert.match(html, /role="tablist"/);
assert.match(html, /aria-live="polite"/);
assert.match(html, /<main id="main">/);
assert.match(html, /class="skip-link"/);
assert.match(css, /@media \(max-width: 560px\)/);
assert.match(css, /@media print/);
assert.match(css, /prefers-reduced-motion/);
assert.match(app, /fetch\(DATA_URL/);
assert.ok(!/fetch\(\s*['"]https?:\/\//.test(app), 'runtime app must not call external services');

console.log('OK — model, functional, accessibility hooks, responsive CSS, print CSS, privacy and GitHub Pages paths');
