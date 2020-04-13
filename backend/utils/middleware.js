/** 
 * 
 * @module utils/middleware */
const morgan = require('morgan');

/**
 * Creates a logger using morgan.
 * @returns A logger for express application
 */
const logger = () => {
  const minimal =
    ':method :url :status :res[content-length] - :response-time ms';

  morgan.token('body', (req) => {
    const body = req.res.req.body;

    if (body.password) {
      body.password = '***';
    }

    return JSON.stringify(body);
  });

  return morgan(`${minimal} :body`);
};

module.exports = { logger };
