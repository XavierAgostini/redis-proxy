class Node {  
  constructor(key, value) {
    if (typeof key !== 'undefined' || typeof key !== null) {
      this.key = key
    }
    if (typeof value !== 'undefined' || typeof value !== null) {
      this.value = value
    }
    this.next = null
    this.prev = null
    this.createTime = new Date().getTime()
  }
}


class Cache {  
  constructor(limit, expiration) {
    
    this._limit = limit
    this.expiration = expiration
    this._size = 0
    this._map = {}
    this._head = null
    this._tail = null
  }

  setHead(node) {
    node.next = this._head
    node.prev = null
    // if head exists
    if (this._head !== null) {
      this._head.prev = node
    }
    this._head = node
    // if tail does not exist
    if (this._tail === null) {
      this._tail = node
    }
    this._size++
    this._map[node.key] = node
  }

  // return an item from the cache
  get(key) {
    if (this._map[key]) {
      const now = new Date().getTime()
      if((now - this._map[key].createTime <= this.expiration)) {
        const value = this._map[key].value
        const node = new Node(key, value)
        this.remove(key)
        this.setHead(node)
        return value
      } else {
        const next =  this._map[key].next
        if (this._map[key].next) this._map[key].next.prev = this._map[key].prev
        if (this._map[key].prev) this._map[key].prev.next = next
        delete this._map[key]
        this._size--
      }
      
    }
  }

  // add an item to the cache. overwrite if already exists
  set(key, value) {
    const node = new Node(key, value)
    if (this._map[key]) {
      this.remove(key)
    } else {
      // if cache is full
      if (this._size >= this._limit) {
        delete this._map[this._tail.key]
        this._size--
        this._tail = this._tail.prev
        if(this._tail) this._tail.next = null
      }
    }
    this.setHead(node)
  }

  // remove an item from the cache
  remove(key) {
    if(this._map[key]) {
      const node = this._map[key]
      // update head and tail
      if (node.prev !== null) {
        node.prev.next = node.next
      } else {
        this._head = node.next
      }
      if (node.next !== null) {
        node.next.prev = node.prev
      } else {
        this._tail = node.prev
      }
      // actually do the removal stuff
      delete this._map[key]
      this._size--
    }
  }

  // reset the cache to an empty and fresh state
  clear(limit = 10) {
    if (typeof limit === 'number') this._limit = limit
    this._size = 0
    this._map = {}
    this._head = null
    this._tail = null
  }

  // Traverse each cached item and call a function
  // callback is passed [node element, element number, cache instance] 
  forEach(callback) {
    let node = this._head
    let i = 0
    while (node) {
      callback.apply(this, [node, i, this])
      i++
      node = node.next
    }
  }

  // return a JSON represenation of the cache
  toJSON() {
    let json = []
    let node = this._head
    while (node) {
      let data = {
        key: node.key,
        value: node.value
      }
      json.push(data)
      node = node.next
    }
    return json
  }
}

module.exports = { Cache: Cache, Node: Node }  