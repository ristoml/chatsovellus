/** 
 * Uses dotenv to configure environment variables, and provides them.
 * @module utils/config */
require('dotenv').config();
const nodeEnv = process.env.NODE_ENV;

/**
 * Port the server listens to.
 */
const PORT = process.env.PORT;

/**
 * PostgreSQL username
 */
const DB_USER = process.env.DB_USER;
/**
 * PostgreSQL database name
 */
let DB_NAME;
/**
 * PostgreSQL password
 */
const DB_PASSWORD = process.env.DB_PASSWORD;

if (nodeEnv === 'production') {
  DB_NAME = process.env.DB_NAME;
}
if (nodeEnv === 'development' || nodeEnv === 'test') {
  DB_NAME = process.env.DEV_DB_NAME;
}

module.exports = { PORT, DB_USER, DB_NAME, DB_PASSWORD };
