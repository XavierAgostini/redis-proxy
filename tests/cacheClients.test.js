const expect = require('expect')
const { redisClient, cacheClient, cacheGet } = require('./../cache/cacheClients')

const testKeys = {
  name: 'Bob Dole',
  age: '45',
  city: 'San Francisco',
  state: 'California',
  country: 'United States of America'
}

beforeEach(() => {
  Object.entries(testKeys).forEach(([key, value]) => redisClient.set(key, value))
})
describe('Caching test with local and Redis caches', () => {
  it ('should initialize Redis with seed data', async function () {
    this.timeout(5000)
    expect(await redisClient.get('name')).toEqual('Bob Dole')
    expect(await redisClient.get('age')).toEqual('45')
    expect(await redisClient.get('city')).toEqual('San Francisco')
    expect(await redisClient.get('state')).toEqual('California')
    expect(await redisClient.get('country')).toEqual('United States of America')
  })
})