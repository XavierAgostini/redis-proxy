const expect = require('expect')
const request = require('supertest')

const {app} = require('./../server.js')


describe('GET /:id', () => {
  it('should find /test', (done) => {
    request(app)
      .get('/test')
      .expect(200)
      .expect((res) => {
        expect(res.body).toBe(1)
      })
      .end(done)
  })
  it('should find /color', (done) => {
    request(app)
      .get('/test')
      .expect(200)
      .expect((res) => {
        expect(res.body).toBe('blue')
      })
      .end(done)
  })

  it('should not find /name', (done) => {
    request(app)
      .get('/test')
      .expect(200)
      .expect((res) => {
        expect(res.body).toBe(1)
      })
      .end(done)
  })
})