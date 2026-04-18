const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 8000;
const host = '0.0.0.0';
const root = __dirname;

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain',
};

const server = http.createServer((req, res) => {
  let requestPath = req.url.split('?')[0];
  if (requestPath === '/') {
    requestPath = '/index.html';
  }

  const filePath = path.join(root, requestPath);

  if (!filePath.startsWith(root)) {
    res.statusCode = 403;
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.statusCode = 404;
      res.end('Not found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache',
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(port, host, () => {
  console.log(`Serving cookie.Clicker at http://${host === '0.0.0.0' ? 'localhost' : host}:${port}`);
  console.log('Open this address in any browser on your device.');
});
