const expect = require('expect')
const { redisClient, cacheClient, cacheGet } = require('./../cache/cacheClients')
const testKeys = require('./seed/seed.json')

describe ('Test Redis cache is working', () => {
  beforeEach(() => {
    Object.entries(testKeys).forEach(([key, value]) => redisClient.set(key, value))
  })
  it ('should initialize Redis with seed data', async function () {
    this.timeout(5000)
    expect(await redisClient.get('name')).toEqual('Bob Dole')
    expect(await redisClient.get('age')).toEqual('45')
    expect(await redisClient.get('city')).toEqual('San Francisco')
    expect(await redisClient.get('state')).toEqual('California')
    expect(await redisClient.get('country')).toEqual('United States of America')
  }) 
})

describe ('Test retrieving values from local and redis cache', () => {
  // need to load keys into redis and local to test
  beforeEach(() => {
    Object.entries(testKeys).forEach(([key, value]) => redisClient.set(key, value))
    Object.entries(testKeys).forEach(([key, value]) => cacheClient.set(key, value))
  })

  it ('should return value from redis if value not in local cache', async () => {
    // this.timeout(500)
    redisClient.set('testKey', 'testValue')
    expect(await cacheGet('testKey')).toEqual('testValue')
    expect(cacheClient.get('testKey')).toEqual('testValue')
  })

  it('should set key in local if found in redis', async () => {
    expect(cacheClient.get('age')).toEqual(45)
    expect(cacheClient.get('city')).toEqual('San Francisco')
    expect(cacheClient.get('state')).toEqual('California')
    expect(cacheClient.get('country')).toEqual('United States of America')
  })

  it('should add new key when at capacity', async () => {
    expect(cacheClient.size).toEqual(4)
    redisClient.set('testKey', 'testValue')
    expect(await cacheGet('testKey')).toEqual('testValue')
    expect(cacheClient.size).toEqual(4)
    expect(cacheClient.get('testKey')).toEqual('testValue')
  })

  it('should replace key if it exists and set updated key to head', async () => {
    expect(cacheClient.tail.key).toEqual('age')
    expect(await cacheGet('age')).toEqual(45)
    expect(cacheClient.tail.key).toEqual('city')
    expect(cacheClient.head.key).toEqual('age')
  })
})