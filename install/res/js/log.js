'use strict';

const fs = require('fs');

const logFile = '/home/.net-server/usr/bin/log/logs.txt';

global.log = (data) => {
  if (data) {
    const time = new Date().toString();
    fs.writeFile(logFile, `${time}: ${data}\n`, { flag: 'a' }, (err) => {
      if (err) console.error(err.message);
    });
  }
};
