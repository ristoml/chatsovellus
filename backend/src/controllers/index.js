const express     = require('express');
const path        = require('path');
const chatRouter  = require('./chat');
const loginRouter = require('./login');
const testRouter  = require('./tests');
const userRouter  = require('./users');
const swaggerDocs = require('../../swagger.json');
const swaggerUi   = require('swagger-ui-express');

const mountRoutes = (app) => {
  app.use('/api/users', userRouter);
  app.use('/api/login', loginRouter);
  app.use('/api/chat',  chatRouter);

  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    app.use('/api/tests', testRouter);
  }
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../dist')));
    app.get('*', (_request, response) => {
      response.sendFile(path.join(__dirname, '../../dist', 'index.html'));
    });
  }

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

module.exports = mountRoutes;

