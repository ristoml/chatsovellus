const app    = require('./app');
const config = require('./utils/config');
const http   = require('http');
const server = http.createServer(app);
require('./socket')(server);

server.listen(config.PORT || 3004, () => {
  console.log(`Server running on port ${config.PORT}`);
});

