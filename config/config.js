const prompt = require('prompt')
const fs = require('fs')

prompt.start()

prompt.get([{
  name: 'Redis Port',
  description: 'TCP port of the backing Redis (Only if explicitly needed)',
  type: 'integer',
  required: false
},{
  name: 'Redis Host',
  description: 'Host address of the backing Redis server',
  type: 'string',
  required: true
},{
  name: 'Expiration',
  description: 'Cache expiry time in ms',
  type: 'integer',
  required: true
}, {
  name: 'Capacity',
  description: 'The number of keys to allow in the cache',
  type: 'integer',
  required: true
}, {
  name: 'Port',
  description: 'The localhost TCP/IP port number the proxy should listen on',
  type: 'integer',
  required: true
}], (err, result) => {
  if (err) {
    return console.log(err)
  }

  if (result['Redis Host'] === '127.0.0.1' || result['Redis Host'] === 'localhost') {
    result['Redis Host'] = 'docker.for.mac.localhost'
  }
  
  const serverConfig = {
    redisURL: result['Redis Host'],
    redisPort: result['Redis Port'],
    expiration: result['Expiration'],
    capacity: result['Capacity'],
    port: result['Port']
  }

  fs.writeFileSync('./.env', `server_port=${result['Port']}:${result['Port']}\nredis_port=${result['Redis Port']}:${result['Redis Port']}\nCOMMAND=npm start`)
  return fs.writeFileSync('config/config.json', JSON.stringify(serverConfig))
})





// configEnv (configJSON) => {
//   const envConfig = configJSON[env]
//   Object.keys(envConfig).forEach((key) => {
//     process.env[key] = envConfig[key]
//   })
// }


  