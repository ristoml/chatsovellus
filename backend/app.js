const express = require('express');
const bodyParser = require('body-parser');
const config = require('./utils/config');
const cors = require('cors');
const app = express();

const Pool = require('pg').Pool;
const pool = new Pool({
  user: config.DB_USER,
  host: 'localhost',
  database: config.DB_NAME,
  password: config.DB_PASSWORD,
  port: 5432
});

const userRouter = require('./controllers/users')(pool);

app.use(cors());
app.use(bodyParser.json());

app.use('/api/users', userRouter);

if (process.env.NODE_ENV === 'development') {
  const testRouter = require('./controllers/tests')(pool);
  app.use('/api/tests', testRouter);
}

module.exports = { app, pool };

