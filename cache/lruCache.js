class Node {  
  constructor (key, value) {
    this.key = key
    this.value = value
    this.next = null
    this.prev = null
    this.createTime = new Date().getTime()
  }
}

// LRU cache with key expiration
class Cache {  
  constructor (capacity, expiration) {
    this.capacity = capacity
    this.expiration = expiration
    this.size = 0
    this.hashSet = {}
    this.head = null
    this.tail = null
  }

  setHead (node) {
    node.next = this.head
    node.prev = null
    // if head exists
    if (this.head) this.head.prev = node
    
    this.head = node
    // if tail does not exist
    if (this.tail === null) {
      this.tail = node
    }
    this.size++
    this.hashSet[node.key] = node
  }

  // return an item from the cache
  get (key) {
    if (this.hashSet[key]) {
      const now = new Date().getTime()
      if ((now - this.hashSet[key].createTime <= this.expiration)) {
        const value = this.hashSet[key].value
        const node = new Node(key, value)
        this.remove(key)
        this.setHead(node)
        return value
      } else {
        this.remove(key)
      }
    }
  }

  // add an item to the cache. overwrite if already exists
  set (key, value) {
    const node = new Node(key, value)
    // if key already exists we will want to 
    if (this.hashSet[key]) {
      this.remove(key)
    } else {
      // if cache is full
      if (this.size >= this.capacity) {
        this.remove(this.tail.key)
      }
    }
    // add new node to head
    this.setHead(node)
  }

  // remove an item from the cache
  remove (key) {
    if (this.hashSet[key]) {
      const node = this.hashSet[key]
      // update head and tail
      if (node.prev !== null) {
        node.prev.next = node.next
      } else {
        this.head = node.next
      }
      if (node.next !== null) {
        node.next.prev = node.prev
      } else {
        this.tail = node.prev
      }
      // actually do the removal stuff
      delete this.hashSet[key]
      this.size--
    }
  }
}

module.exports = { Cache, Node }  