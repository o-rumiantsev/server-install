'use strict';

const os = require('os');
const net = require('net');

const ip = os.networkInterfaces().wlp2s0[0].address;
console.log('Server address is: ' + ip);

const history = new Set();
const sockets = new Map();
let connections = 0;

const server = net.createServer((socket) => {
  const ip = socket.remoteAddress;
  if (!sockets.has(ip)) {
    console.log(`Client ${ip} connected`);
    sockets.set(ip, socket);
    connections++;

    for (const msg of history) socket.write(msg);
    socket.write(
      `\nYou are on server\nOnline ${connections}\nYour IP: ${ip}\n`
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
      sockets.delete(ip);
      connections--;
      sockets.forEach((sckt) => {
        sckt.write(`${ip} disconnected\n`);
      });
    });
  } else socket.end();
});

server.listen(8080, ip);
server.on('error', (err) => {
  throw err;
});
