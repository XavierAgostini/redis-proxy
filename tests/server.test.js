const expect = require('expect')
const request = require('supertest')
const {app} = require('./../server.js')
const {redisClient} = require('./../cache/cacheClients')
const testKeys = {
  name: 'Bob Dole',
  age: 45,
  city: 'San Francisco',
  state: 'California',
  country: 'United States of America'
}

// need to seed redis with data
Object.entries(testKeys).forEach(([key, value]) => redisClient.set(key, value))

// describe('GET /:id', () => {

//   describe('should find keys', () => {
//     it('should find /test', (done) => {
//       request(app)
//         .get('/test')
//         .expect(200)
//         .expect((res) => {
//           // console.l?og('here')
//           console.log(res.body)
//           expect(res.body.test).toBe('Bob Dole')
//         })
//         .end(done)
//     })
//   })
// })

  // STILL need to look into concurrency
  
  // need to test LRU caching

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
// })

