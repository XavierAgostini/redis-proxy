const prompt = require('prompt')
const fs = require('fs')

prompt.start()

prompt.get([{
  name: 'Redis Address',
  description: 'Address of the backing Redis server',
  type: 'string',
  required: true
}, {
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
    redis: result['Redis Address'],
    expiration: result['Expiration'],
    capacity: result['Capacity'],
    port: result['Port']
  }
  return fs.writeFileSync('config.json', JSON.stringify(serverConfig))
})