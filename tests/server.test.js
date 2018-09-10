const expect = require('expect')
const request = require('supertest')
const {app} = require('./../server.js')
const {redisClient} = require('./../cache/cacheClients')
const testKeys = require('./seed/seed.json')

// need to seed redis with data
beforeEach(() => {
  Object.entries(testKeys).forEach(([key, value]) => redisClient.set(key, value))
})

describe('GET /:id', () => {

  describe('should find keys', () => {
    it('should find /name', (done) => {
      request(app)
        .get('/name')
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe('Bob Dole')
        })
        .end(done)
    })
    it('should find /age', (done) => {
      request(app)
        .get('/age')
        .expect(200)
        .expect((res) => {
          expect(res.body.age).toBe(45)
        })
        .end(done)
    })
    it('should find /city', (done) => {
      request(app)
        .get('/city')
        .expect(200)
        .expect((res) => {
          expect(res.body.city).toBe('San Francisco')
        })
        .end(done)
    })
    it('should find /state', (done) => {
      request(app)
        .get('/state')
        .expect(200)
        .expect((res) => {
          expect(res.body.state).toBe('California')
        })
        .end(done)
    })
    it('should find /country', (done) => {
      request(app)
        .get('/country')
        .expect(200)
        .expect((res) => {
          expect(res.body.country).toBe('United States of America')
        })
        .end(done)
    })
  })
})