const app          = require('express')();
const bodyParser   = require('body-parser');
const config       = require('./utils/config');
const cors         = require('cors');
const middleware   = require('./utils/middleware');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi    = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Chat API',
      description: 'Chat application API',
      servers: [`http://localhost:${config.PORT}`]
    }
  },
  apis: ['./controllers/*.js'] 
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const userRouter  = require('./controllers/users');
const loginRouter = require('./controllers/login');

app.use(cors());
app.use(bodyParser.json());
app.use(middleware.logger());

app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
  const testRouter = require('./controllers/tests');
  app.use('/api/tests', testRouter);
}

module.exports = app;

