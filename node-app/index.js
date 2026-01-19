const http = require('http');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`
    <h1>Hello from Node.js in Docker!</h1>
    <p>現在時刻: ${new Date().toLocaleString('ja-JP')}</p>
    <p>Node.js version: ${process.version}</p>
  `);
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
