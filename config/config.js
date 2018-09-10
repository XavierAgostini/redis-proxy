const prompt = require('prompt')
const fs = require('fs')

prompt.start()

prompt.get([{
  name: 'Redis Port',
  description: 'TCP port of the backing Redis (Only if explicitly needed)',
  type: 'integer',
  required: false
},{
  name: 'Redis URL',
  description: 'URL of the backing Redis server',
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
  description: 'TCP/IP port port number the proxy should listen',
  type: 'integer',
  required: true
}], (err, result) => {
  if (err) {
    return console.log(err)
  }
  const serverConfig = {
    redisURL: result['Redis URL'],
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


  