const fs = require('fs')
fs.writeFileSync('./.env', 'server_port=5000:5000\nCOMMAND=npm test')