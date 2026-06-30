const http = require('http'), fs = require('fs'), p = require('path');
const dir = __dirname;
const types = { html:'text/html', mp4:'video/mp4', js:'application/javascript', css:'text/css', ico:'image/x-icon' };

http.createServer((req, res) => {
  let file = req.url === '/' ? 'portfolio-fotografo.html' : req.url.slice(1).split('?')[0];
  let full = p.join(dir, file);

  fs.stat(full, (err, stat) => {
    if (err) { res.writeHead(404); res.end('not found'); return; }
    const ext = p.extname(full).slice(1);
    const mime = types[ext] || 'application/octet-stream';
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10) || 0;
      const end = Math.min(parts[1] ? parseInt(parts[1], 10) : stat.size - 1, stat.size - 1);
      if (start > end) { res.writeHead(416, { 'Content-Range': `bytes */${stat.size}` }); res.end(); return; }
      const chunksize = end - start + 1;
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stat.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': mime
      });
      fs.createReadStream(full, { start, end }).pipe(res);
    } else {
      res.writeHead(200, { 'Content-Type': mime, 'Content-Length': stat.size, 'Accept-Ranges': 'bytes' });
      fs.createReadStream(full).pipe(res);
    }
  });
}).listen(8080, () => console.log('OK'));
