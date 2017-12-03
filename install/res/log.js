'use strict';

const fs = require('fs');

const time = new Date().toString();
const logFile = '/home/.net-server/usr/bin/log/logs.txt';

global.log = (data) => {
  if (data) {
    fs.writeFile(logFile, `${time}: ${data}\n`, { flag: 'a' }, (err) => {
      if (err) console.error(err.message);
    });
  }
}
