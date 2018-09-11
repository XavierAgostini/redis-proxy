# Redis Proxy

## Getting Started:
1. ```git clone https://github.com/XavierAgostini/redis-proxy.git```
2. ```make test```
3. ```make start```
4. You will then be prompted to enter your desired configuration options.
  - Redis server port (optional)
  - Redis host address (required)
  - Local cache capacity (required)
  - Local cache key expiration in ms (required)
  - Localhost port you wish to run the server on (required)

5. You can retrieve results from Redis and have them stored in the local cache by making get requests to your specified `localhost:port/:id`. For example if you have a 'name' key in Redis, it can be retrieved by making a get request to `localhost:port/name`

## Architecture

### File Architecture

```
root/
  cache/
    cacheClient.js          - serves the cached key-value pairs from lru cache and redis
    lruCache.js             - implementation of expiring LRU cache
  config/
    config-dev.json         - environment configurations for development
    config-test.json        - environment configurations for testing
    config.json             - environment configurations for production
    config.js               - config script for gathering user configuration inputs
    evn-config.txt          - placeholder for docker environment variables
  tests/
    seed/
      seed.json             - dummy key-value pairs for testing
    cacheClients.test.js    - test script for cacheClients.js
    lruCache.test.js        - test script for lruCache.js
    server.test.js          - test script for server.js
  .env                      - environment variables used by docker-compose
  docker-compose.test.yml   - docker-compose file for the test environment 
  docker-compose.yml        - docker-compose file for the production environment
  Dockerfile                - file used to build docker
  makefile                  - file used to 'single click' build and start project
  package.json
  README.md
  server.js                 - express server app that serves the cached content
```

### Docker Architecture
Two docker containers are used for this project; Node and Redis. The redis-proxy lives on the Node containter, while a Redis container is spun up only for when automatica test are being run. As this along with user defined network ports requires dynamic docker builds, two docker-compose files are used for testing and production. The testing file includes a Redis container dependency, while the production one does not. In testing, the Node container loads the Redis container as a dependecny allowing it to access a Redis server over the default 127.0.0.1:6379 address. In production the Node container runs in isolation with a user defined port binding it to the host machine. It can also communicate with external Redis servers.

### Server Architecture
The actual proxy server is run through an express.js server. It is configured with user defined configurations that determine the port it is run on as well as the LRU cache (capacity, key limit, expiration time). Key-Value pairs can be accessed by making GET requests (GET /:id) to the server address and specifying the desired key in the URL path. Requests made on the `/:id` route will make the server try to fetch the key-value pair from the LRU cache if it exists, then the Redis cache if it does not. If it exists in Redis, the pair will then be stored in the LRU cache. If it does not exist a 404 error will be sent. When the Redis server goes down, the user won't notice if the key-value pair exist in the LRU cache. If the pair does not exist an error message will be passed notifying the user that the Redis server is not available. The redis-proxy will try to reconnect to the Redis server if this happens. Once it has reconnected, operation will resume as expected.

## LRU Algorithm
The LRU cache is implemented using LRU algorithm a doubly-linked list. A simple hashmap could be used to store and retrieve key-value pairs, but it would not support LRU functionality. To support this functionality I used a combination of a hash map and linked list built using ES6 classes; Node and Cache:

### Node
The Node Class:
Parameters:
  - key
  - value
Properties:
  - key
  - value
  - next: the next linked node
  - prev: the previously linked node
  - createTime: the UTC timestamp of when the node was created. Used for key expiration

### Cache
Parameters:
  - capacity: the max number of keys that be cached
  - expiration: the time to live (TTL) keys have
Properties:
  - capacity
  - expiration
  - size: the number of keys being stored
  - hashSet: a hashmap containing the linked list nodes
  - head: the head node of the linked list
  - tail: the tail node of the linked list
  
### How it works
The LRU cache is initialized with the user defined capacity and key expiration and in a empty state. Keys are added to a hash map where each key is associated with a node in a linked list. As keys are added to the cache, they are added to the head of the list. Key-value paris are retrieved from cache by accessing the node-value assoicated with hash map key. The list is arranged from head to tail in order of most recently used key. The most recently accessed key is at the head, while the least recently used key is at the tail. If the cache gets to capacity the tail node is removed to make room for the new key. If an existing key is accessed, the list is updated to remove the associate node from its posistion in the list, and add it to the head. To support key expiration each node has a `createTime` property that denotes when the key was added to the cache. When keys are accessed in the cache, the algorithm checks if the key has exceeded the expiration time. If it has its removed from the list. Initially thought to add a timer function to each node to automatically remove the node from the list when it expired. But this seemed like it would be quite complex to implement especially when keys are expiring within milliseconds of one another. This implemenation allows keys to be set and retrivied with O(1) time complexity.

## Testing
Testing is broken up into 3 components:
1. LRU Cache
2. LRU cache and Redis cache working in tandem
3. HTTP proxy service

Unit tests are performed on each component to ensure they each work as expected. For testing pursposes, a Redis server is spun up with dummy data to test the caching functionality works as expected.

## Omitted
1. Concurrency: the express server has built in concurrency thanks to node, but the redis client could have been configured to use concurrency by using  [client.multi()](https://github.com/NodeRedis/node_redis/#clientmulticommands). Also didn't check into how the LRU cache would handle concurrent requests. I think I would need to add a queue to batch the requests until they can all be executed to ensure concurrent requests do not break the cache.
