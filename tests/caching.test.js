const expect = require('expect')
const {Cache} = require('./../cache/lruCache')

const testKeys = {
  name: 'Bob Dole',
  age: '45',
  city: 'San Francisco',
  state: 'California',
  country: 'United States of America'
}
describe ('LRU Cache Tests', () => {
  let cache

  beforeEach(() => {
    cache = new Cache(4, 2000)
  })

  it ('should intialize cache with expected properties', () => {
    expect(cache).toMatchObject({
      capacity: 4,
      expiration: 2000,
      size: 0,
      hashSet: {},
      head: null,
      tail: null
    })
  })

  it ('should add new key to cache when not at capacity', () => {
    cache.set('name', 'Bob Dole')
    expect(cache.get('name')).toEqual('Bob Dole')
  })

  it ('should add a new key to cache when at capacity', () => {
    Object.entries(testKeys).forEach(([key, value]) => cache.set(key, value))
    expect(cache.size).toEqual(4)
    expect(cache.head.key).toEqual('country')
    expect(cache.tail.key).toEqual('age')
    expect(cache.get('name')).toEqual(undefined)
    expect(cache.get('country')).toEqual('United States of America')
  })

  it ('should set key to head and tail if cache empty', () => {
    cache.set('name', 'Bob Dole')
    expect(cache.head.key).toEqual('name')
    expect(cache.tail.key).toEqual('name')
    expect(cache.size).toEqual(1)
  })

  it('should replace key if it exists and set updated key to head', () => {
    Object.entries(testKeys).forEach(([key, value]) => cache.set(key, value))
    cache.set('age', '50')
    expect(cache.get('age')).toEqual('50')
    expect(cache.head.key).toEqual('age')
  })

  it('should remove expired key', function (done)  {
    this.timeout(10000)
    cache.set('name', 'Bob Dole')
    setTimeout(() => {
      expect(cache.get('name')).toEqual(undefined)
      expect(cache.size).toEqual(0)
      expect(cache.head).toEqual(null)
      expect(cache.tail).toEqual(null)
      done()
    }, cache.expiration + 1000)
  })
})
    
