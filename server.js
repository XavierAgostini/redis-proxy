const express = require('express')
const redis = require('redis')
const util = require('util')
const {Cache} = require('./cache.js')
const fs = require('fs')

// load in config file
const config = require('./config/config.json')

const redisUrl = `redis://${config.redis}`

console.log(redisUrl)
const client = redis.createClient(redisUrl, {
  // if redis disconnects try reconnecting
  retry_strategy: (options) => {
    // console.log('options', options)
    return Math.min(options.attempt * 100 , 5000);
  }
})

client.get = util.promisify(client.get)

const cache = new Cache(config.capacity)

const app = express()

app.get('/', (req, res) => {
  res.send('Redis Proxy Application')
})

app.get('/t', (req, res) => {
  res.sendStatus(200)
  var r = cache.s
})
app.get('/stats', (req, res) => {
  const stats = cache.size()
  res.send(stats)
})
app.get('/:id', async (req, res) => {
  try {
    console.log('try get ')
    // Get the key to look up in cache
    const id = req.params.id
    // check if key exists in local cache
    const cacheResult = await cache.get(id)
    console.log(`cacheResult: ${cacheResult}`)
    if (cacheResult) {

      // return result of local cache
      console.log('sent from local cache')
      return res.send({[id]: cacheResult})
    } 
    // check if key exists in Redis if not in local cache
    const redisResult = await client.get(id)

    if (redisResult) {
      console.log('sent from redis')
      res.send({[id]: redisResult})
      // check if cache key limit has been reached
      // only cache key if within configured capacity

      // STILL NEED TO ADD LRU eviction for least used key
      
      if (cache.size >= config.capacity) {
        cache.set(id, redisResult, config.expiration)
      }      
    } else {
      // if key does not exist in Redis return 404
      res.sendStatus(404)
    }    
  } catch (e) {
    console.log('caught error')
    console.log(e)
    res.status(400).send(e)
  }
})

app.listen(config.port, () => {
  console.log(`starting server on port ${config.port}`)
})

// export app for test script
module.exports = { app }