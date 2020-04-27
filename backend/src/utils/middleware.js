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
