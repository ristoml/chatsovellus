const app          = require('express')();
const bodyParser   = require('body-parser');
const config       = require('./utils/config');
const cors         = require('cors');
const middleware   = require('./utils/middleware');
const swaggerDocs  = require('./swagger.json');
const swaggerUi    = require('swagger-ui-express');

app.use(cors());
app.use(bodyParser.json());
app.use(middleware.tokenExtractor);
app.use(middleware.logger());

const userRouter  = require('./controllers/users');
const loginRouter = require('./controllers/login');

app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
  const testRouter = require('./controllers/tests');
  app.use('/api/tests', testRouter);
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(middleware.errorHandler);

module.exports = app;

