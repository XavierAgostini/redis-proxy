const express = require('express')
const redis = require('redis')
const util = require('util')
const NodeCache = require('node-cache')

const cache = new NodeCache()
cache.get = util.promisify(cache.get)
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
  // const result = await client.get(id)

  if (cacheResult) {
    res.send(`cache: ${id}: ${cacheResult}`)
  } else {
    const redisResult = await client.get(id)
    if (redisResult) {
      res.send(`redis ${id}: ${redisResult}`)
      cache.set(id, redisResult)
    } else {
      res.send(`redis: ${id}: no result result found`)
    }    
  }
})

app.listen(3000, () => {
  console.log('starting server on port 3000')
})

module.exports = { app }