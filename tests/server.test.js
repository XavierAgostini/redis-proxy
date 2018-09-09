const expect = require('expect')
const request = require('supertest')
const redis = require('redis')
const redisUrl = 'redis://127.0.0.1:6379'
const client = redis.createClient(redisUrl)
const {app} = require('./../server.js')

const testKeys = {
  name: 'Bob Dole',
  age: 45,
  city: 'San Francisco',
  state: 'California',
  country: 'United States of America'
}

Object.entries(testKeys).forEach(([key, value]) => client.set(key, value))

describe('GET /:id', () => {
  it('should find /test', (done) => {
    request(app)
      .get('/test')
      .expect(200)
      // .expect((res) => {
      //   console.log('here')
      //   console.log(res.body)
      //   // expect(res.body.result).toBe(1)
      // })
      .end(done)
  })
  
  // should find existing key in redis
    // key should get set in local cache
    // key should expire after expiration time
      // key should then be returned from redis
  // sif capacity exceeded evict least used key
  // should not return anything for non-existant redis key
  // shouldn't return anything if redis goes down
    // app shouldn't go down
    // results from local cache should still return
  // should be able to reconnect to redis if connection goes down and return a key
})

