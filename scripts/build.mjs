import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'dist');

const files = [
  '.nojekyll',
  '404.html',
  'app.js',
  'index.html',
  'manifest.webmanifest',
  'styles.css',
  'data/tour.json',
  'assets/original/arirang-symbol-red.jpeg',
  'assets/original/maya-joon-signature.png',
  'assets/original/maya-pop-purple.jpeg'
];

fs.rmSync(output, { recursive: true, force: true });

for (const relative of files) {
  const source = path.join(root, relative);
  const destination = path.join(output, relative);
  assert.ok(fs.existsSync(source), `Missing production file: ${relative}`);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination);
}

const sourceTour = fs.readFileSync(path.join(root, 'data/tour.json'));
const builtTour = fs.readFileSync(path.join(output, 'data/tour.json'));
assert.deepEqual(builtTour, sourceTour, 'The production build must copy tour.json without transforming it');

console.log(`OK — production build created with ${files.length} files; tour.json copied unchanged`);

