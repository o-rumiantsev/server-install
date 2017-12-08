'use strict';

const os = require('os');
const net = require('net');
const cli = require(__dirname + '/cli.js');

// cli();

const ip = os.networkInterfaces().wlp2s0[0].address;
if (!global.port) global.port = 8080;
if (global.start && global.log) console.log(
  '\n\x1b[1;32mLogging required\x1b[0m'
);
else global.log = () => {};

const history = new Set();
const sockets = new Map();

function onConnection(socket) {
  const ip = socket.remoteAddress;
  console.log(socket);
  if (!sockets.has(ip)) {
    console.log(`Client ${ip} connected`);
    log(`Client ${ip} connected`);

    sockets.set(ip, socket);

    for (const msg of history) socket.write(msg);
    socket.write(
      `\nYou are on server\nYour IP: ${ip}\n`
    );

    sockets.forEach((sckt) => {
      if (sckt !== socket) {
        sckt.write(`${ip} connected\n`);
      }
    });

    socket.setEncoding('utf8');
    socket.on('data', (data) => {
      if (data !== '\r\n') {
        const msg = `📨  ${ip}: ` + data;
        history.add(msg);
        sockets.forEach((sckt) => {
          if (sckt !== socket) {
            sckt.write(msg);
          }
        });
      }
    });

    socket.on('end', () => {
      console.log(`Client ${ip} disconnected`);
      log(`Client ${ip} disconnected`);
      sockets.delete(ip);
      sockets.forEach((sckt) => {
        sckt.write(`${ip} disconnected\n`);
      });
    });
  } else socket.end();
};

const server = net.createServer(onConnection);

// if (start) {
  server.listen(port, ip, () => {
    console.log(`Server address is: ${ip}\nPort: ${port}`);
    log(`Server is listening for ${ip}:${port}`);
  });

  server.on('error', (err) => {
    log(`Server error occured: ${err.message}`);
    throw err;
  });
// }
