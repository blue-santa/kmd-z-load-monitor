const path = require('path');
const http = require('http');
const app = require('./app');
const exec = require('child_process').exec;

const port = normalizePort(process.env.PORT || '3001');
const dexStats = path.join(__dirname + '/external-calls/dexStats.js');

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
  let workerProcess = exec(`node ${dexStats}`, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
    }
  });
  workerProcess.stdout.on('data', (data) => {
    console.log(data);
  });
});
