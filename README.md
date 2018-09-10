# Redis Proxy

## Getting Started:
1. git clone https://github.com/XavierAgostini/redis-proxy.git
2. make test
3. make start
4. You will then be prompted to enter your desired configuration options.
a. Redis server port (optional)
b. Redis host url (required)
c. Local cache capacity (required)
d. Local cache key expiration in ms (required)
e. Localhost port you wish to run the server on

5. You can retrieve results from Redis and have them stored in the local cache by making get requests to your specified localhost:port/:id. For example if you have a 'name' key in Redis, it can be retrieve by making a get request to localhost:port/name

## Architecture

### File Architecture

```
root/
  cache/
    cacheClient.js - serves the cached key-value pairs from lru cache and redis
    lruCache.js - implementation of expiring LRU cache
  config/
    config-dev.json - environment configurations for development
    config-test.json - environment configurations for testing
    config.json - environment configurations for production
    config.js - config script for gathering user configuration inputs
    evn-config.txt - placeholder for docker environment variables
  tests/
    seed/
      seed.json - dummy key-value pairs for testing
    cacheClients.test.js - test script for cacheClients.js
    lruCache.test.js - test script for lruCache.js
    server.test.js - test script for server.js
  .env - environment variables used by docker-compose
  docker-compose.yml
  package.json
  README.md
  server.js - express server app that serves the cached content
```

### Docker Architecture
1. For testing the redis-proxy is loaded onto its own container that has a dependent redis container linked.
2. For production i'm spinning up the server and redis containers, then shutting them both down, before restarting the server container as the local redis container is no longer needed.
3. The docker-compose file uses dynamic environment variables specified by the user to build the server container. The environment variables are stored in the .env file for easy access

### Server Architecture
1. An express server is spun on the user specifed localhost port
2. Cached resources can be accessed by making GET /:id requests with :id being the desired key whose value you wish to retrieve
3. Concurrency: TODO

## LRU Algorithm
To implement the LRU cache, I used a doubly-linked list. The linked-list nodes are stored in a hash map allowing the keys to be get and set in O(1) time. The max space complexity is the user defined key capacity 0(n).

## Testing
Testing is broken up into 3 components:
1. LRU Cache
2. LRU cache and Redis cache working in tandem
3. HTTP proxy service

## Omitted
1. Concurrency -> could have added node clusters to handle concurrent requests
2. Proxy can't connect to any redis server using the docker container. Wasn't sure if there was an issue with setting up the Docker networking, or the node redis client