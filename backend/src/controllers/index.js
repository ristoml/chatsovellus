const userRouter  = require('./users');
const chatRouter  = require('./chat');
const loginRouter = require('./login');
const testRouter  = require('./tests');
const swaggerDocs = require('../../swagger.json');
const swaggerUi   = require('swagger-ui-express');

const mountRoutes = (app) => {
  app.use('/api/users', userRouter);
  app.use('/api/login', loginRouter);
  app.use('/api/chat',  chatRouter);

  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    app.use('/api/tests', testRouter);
  }

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

module.exports = mountRoutes;

