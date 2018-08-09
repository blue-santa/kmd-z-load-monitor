const path = require('path');
const http = require('http');
const app = require('./app');

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const server = http.createServer(app);

function normalizePort(val) {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
}

server.listen(port);

server.on('listening', () => {
  console.log(`server is listening on port ${server.address().port}`);
});
