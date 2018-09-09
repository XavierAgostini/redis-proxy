const util = require('util')
const redis = require('redis')
const config = require('./../config/config.json')
const {Cache} = require('./lruCache')
const redisUrl = `redis://${config.redis}`

const redisClient = redis.createClient(redisUrl, {
  // if redis disconnects try reconnecting
  retry_strategy: (options) => {
    if (options.error && options.error.code === 'ECONNREFUSED' && options.attempt > 20) {
      return new Error('server down')
    }
    return Math.min(options.attempt * 200 , 5000);
  }
})

redisClient.get = util.promisify(redisClient.get)

const cacheClient = new Cache(config.capacity, config.expiration)

// Create wrapper functoin for cache getting
// from local cache and redis
const cacheGet = async (key) => {
  // check if key exists in local cache
  const cacheResult = cacheClient.get(key)
  // console.log(cache)
  console.log(`cacheResult: ${cacheResult}`)
  if (cacheResult) {
    // return result of local cache
    console.log('sent from local cache')
    return cacheResult
  } 
  // check if key exists in Redis if not in local cache
  const redisResult = await redisClient.get(key)

  if (redisResult) {
    console.log('sent from redis')
    cacheClient.set(key, redisResult)
    return redisResult         
  } else {
    // return new Error('NO_RESULT')
    throw new Error('NO_RESULT')
  }  
}
// exporting redis and local cache clients for testing purposes
module.exports = { redisClient, cacheClient, cacheGet }