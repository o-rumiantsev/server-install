'use strict';

const fs = require('fs');
const process = require('process');
const cp = require('child_process');
const args = process.argv.splice(2);

// CLI for tcp-server package
module.exports = cli;

/* Required options and keys:
* 'start' - start server
* 'remove' - remove package
* 'update' - update to latest version
* 'show-log' - show logs
* 'clear-log' - clear logs
* 'version' - show current version
* '--help' - show help
* '-l' - start with logging
* '-p' - define port
* '-v' - show current version
*/

function showVersion(packageName) {
  const cmd = `dpkg -l ${packageName} | tail -1 | tr -s ' ' | cut -d' ' -f3`
  cp.exec(cmd, (err, stdout, stderr) => {
    if (err) throw err;
    process.stderr.write(stderr);
    process.stdout.write('v' + stdout);
  });
}

function setPort(index) {
  const isPort = !args[index].match(/\D/g);
  if (isPort) global.port = args[index];
  else console.log('ERRWRONGPORT: wrong port declaration');
}

function cli() {
  switch (args[0]) { // first command line argument
    case 'start': { // if 'start'
      global.start = true;
      if (args[1] === '-p') { //if 'start -p' then need <port> argument
        if (!args[2]) { // if no port entered
          console.log('ERRNOPORT: port argument required');
          global.start = false; // dont start
          return;
        }
        setPort(2); // set port
        if (!global.port) global.start = false; // if wrong port dont start
        return;
      }
      if (args[1] === '-l') { // if 'start -l' then require logging
        require('/home/.net-server/usr/bin/log.js');
        if (args[2] === '-p') { // if 'start -l -p' then require logging and need <port> argument
          if (!args[3]) { // if no port entered
            console.log('ERRNOPORT: port argument required');
            global.start = false; // dont start
            return;
          }
          setPort(3); //set port
          if (!global.port) global.start = false; // if wrong port dont start
          return;
        }
      }
      break;
    }
    case 'remove': { // if 'remove'
      global.start = false; // dont start
      fs.delete('/home/.net-server');
      fs.delete('/usr/bin/tcp-server');
    }
    case 'update': { // if 'update'
      global.start = false; // dont start
      cp.execSync('/home/.net-server/usr/bin/update');
      break;
    }
    case 'show-log': { // if 'show-log'
      global.start = false; // dont start
      const logs = fs.readFileSync('/home/.net-server/usr/bin/log/logs.txt');
      console.log(logs.toString());
      break;
    }
    case 'clear-log': { // if 'clear-log'
      global.start = false; // dont start
      const cmd = 'truncate -s 0 /home/.net-server/usr/bin/log/logs.txt'
      cp.execSync(cmd);
      break;
    }
    case 'version': { // if 'version'
      global.start = false; // dont start
      showVersion('tcp-server-chat');
      break;
    }
    case '-v': { // if '-v'
      global.start = false; // dont start
      showVersion('tcp-server-chat');
      break;
    }
    case '--help': { // if '--help'
      global.start = false; // dont start
      const help = fs.readFileSync('/home/.net-server/usr/bin/help/help.txt');
      console.log(help.toString());
      break;
    }
    default: { // if not required arguments
      global.start = false; // dont start
      console.log(
        "Usage: tcp-server [OPTION] ..[KEY]\n" +
        "Type 'tcp-server --help' for aditional info"
      );
    }
  }
}
