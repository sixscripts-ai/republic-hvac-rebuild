import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('dist');
const port = Number(process.env.PORT || 4173);
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.svg':'image/svg+xml', '.txt':'text/plain; charset=utf-8', '.xml':'application/xml; charset=utf-8' };

const server = http.createServer(async (req, res) => {
  try {
    const raw = decodeURIComponent((req.url || '/').split('?')[0]);
    let filePath = path.join(root, raw);
    if (!filePath.startsWith(root)) throw new Error('bad path');
    let info;
    try { info = await stat(filePath); } catch {}
    if (info?.isDirectory()) filePath = path.join(filePath, 'index.html');
    else if (!path.extname(filePath)) filePath = path.join(filePath, 'index.html');
    const body = await readFile(filePath);
    res.writeHead(200, { 'Content-Type': types[path.extname(filePath)] || 'application/octet-stream' });
    res.end(body);
  } catch {
    try {
      const body = await readFile(path.join(root, '404.html'));
      res.writeHead(404, { 'Content-Type':'text/html; charset=utf-8' });
      res.end(body);
    } catch {
      res.writeHead(404); res.end('Not found');
    }
  }
});

server.listen(port, '127.0.0.1', () => console.log(`Preview: http://127.0.0.1:${port}`));
