/**
 *
 * @module utils/middleware */
const chalk  = require('chalk');
const morgan = require('morgan');
const { dateString } = require('./helpers');

/**
 * Creates a logger using morgan.
 * @returns A logger for express application
 */
const logger = () => {
  morgan.token('body', (req) => {
    const body = { ...req.body };

    if (body.password) {
      body.password = '***';
    }
    return '\n' + JSON.stringify(body, null, 2);
  });

  morgan.token('date', () => {
    return '[' + dateString(new Date()) + ']';
  });

  return morgan((tokens, req, res) => {
    return (
      chalk.green.bold(tokens.date(req, res)) + ' ' +
      chalk.green.inverse.bold(' ' + tokens.method(req, res) + ' ') +
      chalk.red.bold.inverse(' ' + tokens.status(req, res) + ' ') +
      ' ' +
      chalk.white(tokens.url(req, res)) + ' ' +
      chalk.yellow(tokens['response-time'](req, res) + ' ms') + ' ' +
      chalk.white(tokens.body(req, res))
    );
  });
};

const errorHandler = (error, request, response, next) => {
  if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'invalid token' });
  }
  next(error);
};


const tokenExtractor = (request, response, next) => {
  const getTokenFrom = (request) => {
    const authorization = request.get('authorization');
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      return authorization.substring(7);
    }
    return null;
  };

  request.token = getTokenFrom(request);
  next();
};


module.exports = { logger, errorHandler, tokenExtractor };
