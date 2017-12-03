'use strict';

const fs = require('fs');

const time = new Date().toString();

global.log = (data) => {
  if (data) {
    fs.writeFile('./log/logs.txt', `${time}: ${data}\n`, { flag: 'a' }, (err) => {
      if (err) console.error(err.message);
    });
  }
}
