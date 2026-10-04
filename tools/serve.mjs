import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.env.PORT || 4173);
const base = '/arirang-surprisesong-tracker';
const mime = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.mjs':'text/javascript; charset=utf-8', '.json':'application/json; charset=utf-8', '.webmanifest':'application/manifest+json', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.webp':'image/webp' };

const server = http.createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === base) return void response.writeHead(302, { Location: `${base}/` }).end();
  if (pathname.startsWith(`${base}/`)) pathname = pathname.slice(base.length);
  if (pathname === '/') pathname = '/index.html';
  const file = path.resolve(root, `.${pathname}`);
  if (!file.startsWith(root)) return void response.writeHead(403).end('Forbidden');
  fs.stat(file, (error, stat) => {
    const target = !error && stat.isFile() ? file : path.join(root, '404.html');
    fs.readFile(target, (readError, body) => {
      if (readError) return void response.writeHead(500).end('Server error');
      response.writeHead(target.endsWith('404.html') ? 404 : 200, { 'Content-Type': mime[path.extname(target)] || 'application/octet-stream', 'Cache-Control':'no-store' });
      response.end(body);
    });
  });
});

server.listen(port, '127.0.0.1', () => console.log(`Local preview: http://127.0.0.1:${port}/\nGitHub Pages path: http://127.0.0.1:${port}${base}/`));
