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
  // it('should find /color', (done) => {
  //   request(app)
  //     .get('/color')
  //     .expect(200)
  //     .expect((res) => {
  //       expect(res.body.color).toBe('blue')
  //     })
  //     .end(done)
  // })

  // it('should not find /name', (done) => {
  //   request(app)
  //     .get('/test')
  //     .expect(200)
  //     .expect((res) => {
  //       expect(res.body.result).toBe(1)
  //     })
  //     .end(done)
  // })
})

