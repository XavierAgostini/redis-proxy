const express = require('express')
const redis = require('redis')
const util = require('util')
const NodeCache = require('node-cache')
const fs = require('fs')

const cache = new NodeCache()
cache.get = util.promisify(cache.get)

// load in config file
const config = require('./config/config.json')
console.log(config.port)
const redisUrl = 'redis://127.0.0.1:6379'
const client = redis.createClient(redisUrl)
client.get = util.promisify(client.get)

const app = express()

app.get('/', (req, res) => {
  res.send('Redis Proxy Application')
})
app.get('/:id', async (req, res) => {
  const id = req.params.id
  const cacheResult = await cache.get(id)
  var result
  // const result = await client.get(id)

  if (cacheResult) {
    console.log(`cache: ${id}: ${cacheResult}`)
    result = cacheResult
    res.send({id: cacheResult})
  } else {
    const redisResult = await client.get(id)
    if (redisResult) {
      result =
      console.log(`redis ${id}: ${redisResult}`)
      cache.set(id, redisResult)
      res.send({id: redisResult})
    } else {
      console.log(`redis: ${id}: no result result found`)
      res.send({})
    }    
  }
})

app.listen(3000, () => {
  console.log('starting server on port 3000')
})

module.exports = { app }