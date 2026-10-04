const DATA_URL = './data/tour.json';

export function canonicalSongKey(title) {
  return title.trim().toLocaleLowerCase('en').replace(/\s+/g, ' ');
}

export function buildTourModel(data) {
  const shows = [...data.shows].sort((a, b) => a.date.localeCompare(b.date));
  const completed = shows.filter(show => show.status === 'completed');
  const upcoming = shows.filter(show => show.status === 'upcoming');
  const firstAppearanceBySong = new Map();
  const occurrencesBySong = new Map();

  for (const show of completed) {
    const orderedSongs = [...show.surpriseSongs].sort((a, b) => a.performanceOrder - b.performanceOrder);
    for (const song of orderedSongs) {
      const key = canonicalSongKey(song.title);
      if (!firstAppearanceBySong.has(key)) firstAppearanceBySong.set(key, show.id);
      if (!occurrencesBySong.has(key)) occurrencesBySong.set(key, { title: song.title, shows: [] });
      occurrencesBySong.get(key).shows.push({ show, song });
    }
  }

  const countries = new Map();
  const cities = new Map();
  for (const show of shows) {
    const countryKey = show.country.code;
    if (!countries.has(countryKey)) countries.set(countryKey, { country: show.country, shows: [] });
    countries.get(countryKey).shows.push(show);
    const cityKey = `${show.city}|${show.country.code}`;
    if (!cities.has(cityKey)) cities.set(cityKey, { city: show.city, country: show.country, venue: show.venue, coordinates: show.coordinates, shows: [] });
    cities.get(cityKey).shows.push(show);
  }

  return { data, shows, completed, upcoming, firstAppearanceBySong, occurrencesBySong, countries, cities };
}

export function projectPoint(latitude, longitude) {
  return { x: ((longitude + 180) / 360) * 1000, y: ((90 - latitude) / 180) * 500 };
}

export function isFirstAppearance(model, showId, title) {
  return model.firstAppearanceBySong.get(canonicalSongKey(title)) === showId;
}

const dateLong = new Intl.DateTimeFormat('en', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const dateShort = new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const parseDate = value => new Date(`${value}T12:00:00Z`);
const formatLong = value => dateLong.format(parseDate(value));
const formatShort = value => dateShort.format(parseDate(value));
const escapeHtml = value => String(value).replace(/[&<>'"]/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[char]));

function songListHtml(model, show) {
  if (show.status === 'upcoming') return '<p class="upcoming-copy">Upcoming</p>';
  return `<ol class="song-list">${show.surpriseSongs
    .slice().sort((a,b) => a.performanceOrder - b.performanceOrder)
    .map(song => `<li><span class="song-number">${song.performanceOrder}</span><span class="${isFirstAppearance(model, show.id, song.title) ? 'first-song' : ''}">${escapeHtml(song.title)}</span></li>`)
    .join('')}</ol>`;
}

function showCardHtml(model, show) {
  return `<article class="show-card ${show.status}">
    <div class="show-card-head"><span class="date-label">${formatShort(show.date)} · D${show.dayNumber}</span><span class="status-pill">${show.status}</span></div>
    ${songListHtml(model, show)}
  </article>`;
}

function initGreeting() {
  const target = document.querySelector('#greeting');
  if (!target) return;
  const greetings = ['Welcome! 💜','Bem-vindos! 💜','Willkommen! 💜','환영합니다! 💜','¡Bienvenidos! 💜','Bienvenue ! 💜','ようこそ！💜','Choose a stop and explore the tour ✦'];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) { target.textContent = greetings.at(-1); return; }
  let index = 0;
  const timer = window.setInterval(() => {
    target.classList.add('fade');
    window.setTimeout(() => {
      index += 1;
      target.textContent = greetings[Math.min(index, greetings.length - 1)];
      target.classList.remove('fade');
      if (index === greetings.length - 1) window.clearInterval(timer);
    }, 250);
  }, 2000);
}

function renderStats(model) {
  document.querySelector('#stat-shows').textContent = model.shows.length;
  document.querySelector('#stat-completed').textContent = model.completed.length;
  document.querySelector('#stat-songs').textContent = model.occurrencesBySong.size;
  document.querySelector('#updated-through').textContent = `Updated through ${model.data.dataset.completedThroughLabel} · ${formatLong(model.data.dataset.completedThrough)}`;
  const next = model.upcoming[0];
  document.querySelector('#next-show').textContent = next ? `Next: ${next.label} · ${formatLong(next.date)}` : 'Tour calendar complete';
}

function renderMap(model, openCity) {
  const root = document.querySelector('#map-markers');
  const cityButtons = document.querySelector('#map-city-buttons');
  root.replaceChildren();
  cityButtons.replaceChildren();
  const ns = 'http://www.w3.org/2000/svg';
  for (const [key, city] of model.cities) {
    const { x, y } = projectPoint(city.coordinates.latitude, city.coordinates.longitude);
    const complete = city.shows.some(show => show.status === 'completed');
    const group = document.createElementNS(ns, 'g');
    group.setAttribute('class', `map-marker ${complete ? 'completed' : 'upcoming'}`);
    group.setAttribute('role', 'button');
    group.setAttribute('tabindex', '0');
    group.setAttribute('aria-label', `${city.city}, ${city.country.name}: ${city.shows.length} show${city.shows.length === 1 ? '' : 's'}, ${complete ? 'includes completed shows' : 'upcoming'}`);
    group.dataset.cityKey = key;
    group.innerHTML = `<circle class="hit" cx="${x}" cy="${y}" r="16"></circle><circle class="ring" cx="${x}" cy="${y}" r="5.5"></circle><text x="${x + 10}" y="${y - 8}">${escapeHtml(city.city)}</text>`;
    group.addEventListener('click', () => openCity(key, group));
    group.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openCity(key, group); }
    });
    root.append(group);

    const button = document.createElement('button');
    button.type = 'button';
    button.className = complete ? 'completed' : 'upcoming';
    button.textContent = `${city.city} · ${city.shows.length}`;
    button.setAttribute('aria-label', `Open ${city.city}, ${city.country.name}: ${city.shows.length} shows`);
    button.addEventListener('click', () => openCity(key, button));
    cityButtons.append(button);
  }
}

function initCitySheet(model) {
  const sheet = document.querySelector('#city-sheet');
  const backdrop = document.querySelector('#sheet-backdrop');
  const close = document.querySelector('#sheet-close');
  const content = document.querySelector('#sheet-content');
  let returnFocus = null;

  function closeSheet() {
    sheet.hidden = true;
    backdrop.hidden = true;
    document.body.style.overflow = '';
    returnFocus?.focus();
  }
  function openCity(key, trigger) {
    const city = model.cities.get(key);
    returnFocus = trigger;
    content.innerHTML = `<p class="sheet-kicker">${escapeHtml(city.country.name)} · ${city.shows.length} show${city.shows.length === 1 ? '' : 's'}</p>
      <h2 id="sheet-title">${escapeHtml(city.city)}</h2>
      <p class="sheet-venue">${escapeHtml(city.venue)}</p>
      <div class="show-grid">${city.shows.map(show => showCardHtml(model, show)).join('')}</div>`;
    sheet.hidden = false;
    backdrop.hidden = false;
    document.body.style.overflow = 'hidden';
    close.focus();
  }
  close.addEventListener('click', closeSheet);
  backdrop.addEventListener('click', closeSheet);
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !sheet.hidden) closeSheet(); });
  return openCity;
}

function renderCountry(model, code) {
  const view = document.querySelector('#country-view');
  const entry = model.countries.get(code);
  const grouped = new Map();
  for (const show of entry.shows) {
    if (!grouped.has(show.city)) grouped.set(show.city, []);
    grouped.get(show.city).push(show);
  }
  view.innerHTML = `<div class="country-header"><h3>${escapeHtml(entry.country.name)}</h3><span>${entry.shows.length} show${entry.shows.length === 1 ? '' : 's'}</span></div>
    ${[...grouped].map(([city, shows]) => `<section class="city-group"><h4>${escapeHtml(city)}</h4><div class="show-grid">${shows.map(show => showCardHtml(model, show)).join('')}</div></section>`).join('')}`;
}

function initCountries(model) {
  const select = document.querySelector('#country-select');
  const entries = [...model.countries.entries()].sort((a,b) => a[1].country.name.localeCompare(b[1].country.name));
  select.innerHTML = entries.map(([code, entry]) => `<option value="${code}">${escapeHtml(entry.country.name)} · ${entry.shows.length}</option>`).join('');
  const preferred = entries.find(([code]) => code === 'US')?.[0] ?? entries[0][0];
  select.value = preferred;
  renderCountry(model, preferred);
  select.addEventListener('change', () => renderCountry(model, select.value));
}

function highlightedTitle(title, query) {
  if (!query) return escapeHtml(title);
  const index = title.toLowerCase().indexOf(query.toLowerCase());
  if (index < 0) return escapeHtml(title);
  return `${escapeHtml(title.slice(0,index))}<mark>${escapeHtml(title.slice(index,index + query.length))}</mark>${escapeHtml(title.slice(index + query.length))}`;
}

function renderSongs(model, query = '') {
  const view = document.querySelector('#song-view');
  const clean = query.trim().toLowerCase();
  const entries = [...model.occurrencesBySong.values()]
    .filter(entry => !clean || entry.title.toLowerCase().includes(clean))
    .sort((a,b) => a.title.localeCompare(b.title));
  if (!entries.length) { view.innerHTML = '<p class="empty-state">No surprise songs match that search.</p>'; return; }
  view.innerHTML = `<div class="song-header"><h3>${clean ? 'Search results' : 'All songs'}</h3><span>${entries.length} song${entries.length === 1 ? '' : 's'}</span></div>
    <div class="song-results">${entries.map(entry => `<article class="song-result"><h4>${highlightedTitle(entry.title, query)}</h4><p>${entry.shows.length} performance${entry.shows.length === 1 ? '' : 's'}</p><ol>${entry.shows.map(({show}) => `<li class="${isFirstAppearance(model, show.id, entry.title) ? 'first-song' : ''}">${escapeHtml(show.label)} · ${formatShort(show.date)}</li>`).join('')}</ol></article>`).join('')}</div>`;
}

function initSongs(model) {
  const search = document.querySelector('#song-search');
  renderSongs(model);
  search.addEventListener('input', () => renderSongs(model, search.value));
}

function renderTimeline(model) {
  const leg = document.querySelector('#tour-leg-filter').value;
  const status = document.querySelector('#tour-status-filter').value;
  const shows = model.shows.filter(show => (leg === 'all' || show.leg === leg) && (status === 'all' || show.status === status));
  document.querySelector('#tour-view').innerHTML = shows.map(show => `<article class="timeline-item ${show.status}">
    <div class="timeline-date">${formatShort(show.date)}</div>
    <div class="timeline-content"><h4>${escapeHtml(show.label)} · ${escapeHtml(show.country.name)}</h4><p class="venue">${escapeHtml(show.venue)}</p>
    ${show.status === 'completed' ? `<p class="inline-songs">${show.surpriseSongs.sort((a,b)=>a.performanceOrder-b.performanceOrder).map(song => `<span class="${isFirstAppearance(model, show.id, song.title) ? 'first-song' : ''}">${escapeHtml(song.title)}</span>`).join('')}</p>` : '<p class="upcoming-copy">Upcoming</p>'}</div>
  </article>`).join('') || '<p class="empty-state">No shows match these filters.</p>';
}

function initTimeline(model) {
  const leg = document.querySelector('#tour-leg-filter');
  const status = document.querySelector('#tour-status-filter');
  leg.insertAdjacentHTML('beforeend', model.data.legs.map(item => `<option value="${item.id}">${escapeHtml(item.label)}</option>`).join(''));
  leg.addEventListener('change', () => renderTimeline(model));
  status.addEventListener('change', () => renderTimeline(model));
  renderTimeline(model);
}

function printShowHtml(model, show) {
  return `<article class="print-show"><h2>${formatShort(show.date)} · ${escapeHtml(show.label)} · ${escapeHtml(show.country.name)}</h2>
    ${show.status === 'completed' ? `<p>${show.surpriseSongs.map(song => `<span class="${isFirstAppearance(model, show.id, song.title) ? 'first-song' : ''}">${escapeHtml(song.title)}</span>`).join(' · ')}</p>` : '<p>Upcoming</p>'}</article>`;
}

function buildPrintDocument(model, scope) {
  let shows = model.shows;
  let title = 'Full Tour';
  if (scope.startsWith('leg:')) {
    const id = scope.slice(4);
    shows = shows.filter(show => show.leg === id);
    title = model.data.legs.find(leg => leg.id === id)?.label ?? title;
  } else if (scope.startsWith('country:')) {
    const code = scope.slice(8);
    shows = shows.filter(show => show.country.code === code);
    title = model.countries.get(code)?.country.name ?? title;
  }
  document.querySelector('#print-document').innerHTML = `<header class="print-head"><div><h1>BTS ARIRANG TOUR</h1><p>Surprise Songs Tracker · ${escapeHtml(title)}</p></div><p>Created by Maya Joon</p></header>
    <p class="print-meta">Updated through ${escapeHtml(model.data.dataset.completedThroughLabel)} · ★ first appearance · ${shows.length} shows</p>
    <div class="print-grid">${shows.map(show => printShowHtml(model, show)).join('')}</div>
    <p class="print-footer">Fan-made BTS OT7 project. First appearances are calculated chronologically from the master dataset.</p>`;
}

function initPrint(model) {
  const select = document.querySelector('#print-scope');
  const legs = model.data.legs.map(leg => `<option value="leg:${leg.id}">Leg · ${escapeHtml(leg.label)}</option>`).join('');
  const countries = [...model.countries.entries()].sort((a,b)=>a[1].country.name.localeCompare(b[1].country.name)).map(([code, entry]) => `<option value="country:${code}">Country · ${escapeHtml(entry.country.name)}</option>`).join('');
  select.insertAdjacentHTML('beforeend', legs + countries);
  buildPrintDocument(model, select.value);
  select.addEventListener('change', () => buildPrintDocument(model, select.value));
  document.querySelector('#print-button').addEventListener('click', () => { buildPrintDocument(model, select.value); window.print(); });
}

function initTabs() {
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  function activate(name, focus = false) {
    for (const tab of tabs) {
      const active = tab.dataset.tab === name;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      document.querySelector(`[data-panel="${tab.dataset.tab}"]`).hidden = !active;
      if (active && focus) tab.focus();
    }
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tab.dataset.tab));
    tab.addEventListener('keydown', event => {
      if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      activate(tabs[next].dataset.tab, true);
    });
  });
  document.querySelectorAll('[data-tab-jump]').forEach(button => button.addEventListener('click', () => {
    activate(button.dataset.tabJump);
    document.querySelector('#explore').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }));
}

async function start() {
  initGreeting();
  initTabs();
  try {
    const response = await fetch(DATA_URL, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Tour data returned ${response.status}`);
    const model = buildTourModel(await response.json());
    renderStats(model);
    const openCity = initCitySheet(model);
    renderMap(model, openCity);
    initCountries(model);
    initSongs(model);
    initTimeline(model);
    initPrint(model);
    document.documentElement.dataset.ready = 'true';
  } catch (error) {
    console.error(error);
    document.querySelector('#updated-through').textContent = 'Tour data could not be loaded.';
    document.querySelector('#next-show').textContent = 'Please refresh or try again later.';
  }
}

if (typeof document !== 'undefined') start();
