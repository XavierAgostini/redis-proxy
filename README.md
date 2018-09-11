# Redis Proxy

## Getting Started:
1. ```git clone https://github.com/XavierAgostini/redis-proxy.git```
2. ```make test```
3. ```make start```
4. You will then be prompted to enter your desired configuration options.
-- Redis server port (optional)
-- Redis host address (required)
-- Local cache capacity (required)
-- Local cache key expiration in ms (required)
-- Localhost port you wish to run the server on (required)

5. You can retrieve results from Redis and have them stored in the local cache by making get requests to your specified localhost:port/:id. For example if you have a 'name' key in Redis, it can be retrieve by making a get request to localhost:port/name

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
1. For testing the redis-proxy is loaded onto its own container that has a dependent redis container linked.
2. For production i'm spinning up the server and redis containers, then shutting them both down, before restarting the server container as the local redis container is no longer needed.
3. The docker-compose file uses dynamic environment variables specified by the user to build the server container. The environment variables are stored in the .env file for easy access

### Server Architecture
1. An express server is spun on the user specifed localhost port
2. Cached resources can be accessed by making GET /:id requests with :id being the desired key whose value you wish to retrieve
3. Concurrency: TODO

## LRU Algorithm
To implement the LRU cache, I used a doubly-linked list. The linked-list nodes are stored in a hash map allowing the keys to be get and set with O(1) time complexity.

## Testing
Testing is broken up into 3 components:
1. LRU Cache
2. LRU cache and Redis cache working in tandem
3. HTTP proxy service

## Omitted
1. Concurrency: the node has built in concurrency, but the redis client could have been configured to use concurrency by using  [client.multi()](https://github.com/NodeRedis/node_redis/#clientmulticommands). Also didn't check into how the LRU cache would handle concurrent requests. I think I would need to add a queue to batch the requests until they can all be executed.