const express = require('express')

const {cache} = require('./cache/lruCache.js')

// load in config file
const config = require('./config/config.json')

// load in caching client
const {cacheGet} = require('./cache/cacheClients')

const app = express()

app.get('/', (req, res) => {
  res.send('Redis Proxy Application')
})

app.get('/:id', async (req, res) => {
  try {
    const id = req.params.id
    const result = await cacheGet(id)
    console.log('result',result)
    res.send({[id]: result})   
  } catch (e) {
    if (e.message === 'NO_RESULT') {
      return res.sendStatus(404)
    }
    res.status(400).send(e)
  }
})

app.listen(config.port, () => {
  console.log(`starting server on port ${config.port}`)
})

// export app for test script
module.exports = { app }