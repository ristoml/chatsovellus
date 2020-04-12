const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const userRouter  = require('./controllers/users');
const loginRouter = require('./controllers/login');

app.use(cors());
app.use(bodyParser.json());

app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);

if (process.env.NODE_ENV === 'development') {
  const testRouter = require('./controllers/tests');
  app.use('/api/tests', testRouter);
}

module.exports = app;

