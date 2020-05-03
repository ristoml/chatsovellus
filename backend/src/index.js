const app    = require('./app');
const chalk  = require('chalk');
const config = require('./utils/config');
const http   = require('http');
const server = http.createServer(app);
require('./socket')(server);

const PORT = config.PORT || 3004;

server.listen(PORT, () => {
  console.log(
    `${chalk.bold.green('[Chat Server]')} Server running on port ${chalk.bold.red(PORT)}`
  );
});

