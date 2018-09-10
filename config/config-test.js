const fs = require('fs')
fs.writeFileSync('./.env', `server_port=5000:5000\nredis_port=6379:6379\nCOMMAND=npm test`)