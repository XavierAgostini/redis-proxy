const express = require('express')

// load in caching client
const {cacheGet, config} = require('./cache/cacheClients')

const app = express()

app.get('/', (req, res) => {
  res.send('Redis Proxy Application')
})

app.get('/:id', async (req, res) => {
  try {
    const id = req.params.id
    const result = await cacheGet(id)
    res.send({[id]: result})   
  } catch (e) {
    console.error(e)
    if (e.message === 'NO_RESULT') {
      return res.status(404).send('No value was found for that key')
    }
    res.status(500).send('Oops looks like the Redis server disconnected. Please ensure your Redis server is running. Refresh the page to try again.')
  }
})

// dynamically config proxy server port depending on user prompt
app.listen(config.port, () => {
  console.log(`Starting server on port ${config.port}...`)
  console.log(`You can test this by navigating to localhost:${config.port}/<key>`)
})

// export app for test script
module.exports = { app }