# Build and test report

Initial full review completed on 2026-10-04. Dataset checks, application smoke tests and the production build were rerun successfully on 2026-10-09 for the Lima D1 update.

## Automated checks

- Dataset validation: passed — 88 official shows, 51 completed, 37 upcoming, 59 unique surprise songs.
- Application smoke tests: passed — canonical-data loading, chronological first appearances, filters, accessibility hooks, responsive CSS, print CSS, privacy constraints, and GitHub Pages relative paths.

Run both checks with the bundled Node.js runtime or any current Node.js installation:

```sh
node scripts/validate.mjs
node tests/smoke.mjs
```

## Browser verification

- Desktop viewport (1440 × 900): no document-level horizontal overflow; all headline counts matched `data/tour.json`.
- Mobile viewport (390 × 844): no document-level horizontal overflow; the map remains intentionally scrollable inside its own frame.
- Interactive map: 34 data-derived city choices; completed and upcoming stops share the same canonical records.
- City details: Bogotá D1 and D2 were checked, including the validated D2 pairing `We Are Bulletproof Pt.2` → `Mikrokosmos`.
- Songs view: search, occurrence totals, and first-appearance output checked with `Spring Day`.
- Full Tour view: the Upcoming filter returned all 37 announced future shows without song placeholders.
- Print view: country-scoped output checked with Brazil; print-only document content and print stylesheet were present.
- Keyboard: tablist arrow-key movement updates focus, selection, and the visible panel together.
- Browser console: no warnings or errors after loading and exercising the main views.
- Opening-page TikTok credit: visible and responsive, with a direct `@mayajoonofficial` link, safe new-tab attributes, and no embedded third-party content.
- Reduced motion: greeting rotation and decorative motion are disabled through `prefers-reduced-motion` handling.
- GitHub Pages: verified under `/arirang-surprisesong-tracker/` using relative asset and data paths; `404.html` and `.nojekyll` are included.

## Architecture confirmation

`data/tour.json` is the only tour-data source. Countries, Songs, Full Tour, Print, map markers, totals, current/next-show messaging, and first appearances are computed at runtime from that file. The site has no analytics, cookies, trackers, forms, accounts, or third-party runtime dependencies.
