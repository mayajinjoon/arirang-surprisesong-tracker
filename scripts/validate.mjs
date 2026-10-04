import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const data = JSON.parse(fs.readFileSync(path.join(root, 'data/tour.json'), 'utf8'));
const errors = [];
const sourceIds = new Set(data.sources.map(s => s.id));
const ids = new Set();
let previousDate = '';

for (const show of data.shows) {
  if (ids.has(show.id)) errors.push(`duplicate show id: ${show.id}`);
  ids.add(show.id);
  if (show.date < previousDate) errors.push(`out of chronology: ${show.id}`);
  previousDate = show.date;
  if (show.status === 'upcoming' && show.surpriseSongs.length) errors.push(`upcoming show has songs: ${show.id}`);
  if (show.status === 'completed' && show.surpriseSongs.length !== 2) errors.push(`completed show must have exactly 2 surprise songs: ${show.id}`);
  show.surpriseSongs.forEach((song, i) => {
    if (song.performanceOrder !== i + 1) errors.push(`bad performanceOrder: ${show.id}`);
    for (const sourceId of song.sourceIds) if (!sourceIds.has(sourceId)) errors.push(`unknown source ${sourceId}: ${show.id}`);
  });
  for (const sourceId of show.scheduleSourceIds) if (!sourceIds.has(sourceId)) errors.push(`unknown schedule source ${sourceId}: ${show.id}`);
}

const completed = data.shows.filter(s => s.status === 'completed');
const upcoming = data.shows.filter(s => s.status === 'upcoming');
if (data.shows.length !== data.dataset.totalShows) errors.push('dataset.totalShows mismatch');
if (completed.length !== data.dataset.completedShows) errors.push('dataset.completedShows mismatch');
if (upcoming.length !== data.dataset.upcomingShows) errors.push('dataset.upcomingShows mismatch');

const cityDays = new Map();
for (const show of data.shows) {
  const key = `${show.city}|${show.country.code}`;
  const expected = (cityDays.get(key) ?? 0) + 1;
  if (show.dayNumber !== expected) errors.push(`dayNumber expected D${expected}: ${show.id}`);
  cityDays.set(key, expected);
}

const firstAppearances = new Map();
for (const show of completed) {
  for (const song of show.surpriseSongs) {
    const key = song.title.trim().toLocaleLowerCase('en');
    if (!firstAppearances.has(key)) firstAppearances.set(key, { title: song.title, showId: show.id });
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`OK — ${data.shows.length} shows; ${completed.length} completed; ${upcoming.length} upcoming; ${firstAppearances.size} unique surprise songs`);
