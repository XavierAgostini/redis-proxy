const yargs = require('yargs')
const _ = require('lodash')
const fs = require('fs')

const argv = yargs
  .command('configure', 'Configure and start proxy server', {
    redis: {
      describe: 'Address of the backing Redis server',
      demand: true,
      alias: 'r'
    },
    expiration: {
      describe: 'Cache expiry time',
      demand: true,
      alias: 'e'
    },
    capacity: {
      describe: 'The number of keys to allow in the cache',
      demand: true,
      alias: 'c'
    },
    port: {
      describe: 'TCP/IP port port number the proxy should listen on',
      demand: true,
      alias: 'p'
    }
  })
  .help()
  .argv

const command = argv._[0]

if (command === 'configure') {
  const serverConfig = {
    redis: argv.redis,
    expiration: argv.expiration,
    capacity: argv.capacity,
    port: argv.port
  }
  fs.writeFileSync('config/config.json', JSON.stringify(serverConfig))
  console.log(serverConfig)
} else {
  console.log('Enter a valid command')
}