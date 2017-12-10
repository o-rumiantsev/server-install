'use strict';

const os = require('os');
const net = require('net');
const cli = require(__dirname + '/cli.js');

cli();

const ip = os.networkInterfaces().wlp2s0[0].address;
if (!global.port) global.port = 8080;
if (global.start && global.log) console.log(
  '\n\x1b[1;32mLogging required\x1b[0m'
);
else global.log = () => {};

const rooms = {};
const sockets = new Map();


function onConnection(socket) {
  const ip = socket.remoteAddress;
  let room = '';

  if (!sockets.has(ip)) {
    console.log(`Client ${ip} connected`);
    global.log(`Client ${ip} connected`);

    sockets.set(ip, socket);

    const send = (room, data) => {
      const msg = data;
      rooms[room].forEach((sckt) => {
        if (sckt !== socket) {
          sckt.write(msg);
        }
      });
    };

    socket.setEncoding('utf8');
    socket.on('data', (data) => {
      if (data.startsWith('###Room###')) {
        room = data.substr(10).split('|')[0];

        socket.write(
          `\nYou are on server\nRoom: ${room}\n`
        );

        const msg = data.substr(10).split('|')[1];
        if (!rooms[room]) {
          const clients = new Set();
          rooms[room] = clients;
        }
        rooms[room].add(socket);
        send(room, msg);
      } else if (data !== '\r\n') send(room, data);
    });

    socket.on('end', () => {
      sockets.delete(ip);
      rooms[room].delete(socket);
      console.log(`Client ${ip} disconnected`);
      global.log(`Client ${ip} disconnected`);
    });
  } else socket.end();
}

const server = net.createServer(onConnection);

if (global.start) {
  server.listen(global.port, ip, () => {
    console.log(`Server address is: ${ip}\nPort: ${global.port}`);
    global.log(`Server is listening for ${ip}:${global.port}`);
  });

  server.on('error', (err) => {
    global.log(`Server error occured: ${err.message}`);
    throw err;
  });
}
