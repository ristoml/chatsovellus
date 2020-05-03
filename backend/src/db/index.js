/**
 * Creates a connection pool using node-postgres and provides methods for communicating with the database.
 * @module db */
const config = require('../utils/config');
const chalk  = require('chalk');

const Pool = require('pg').Pool;
const pool = new Pool({
  user: config.DB_USER,
  host: 'localhost',
  database: config.DB_NAME,
  password: config.DB_PASSWORD,
  port: 5432
});

console.log(
  chalk.bold.green('[Chat Server]') +
  ' Pool created. User: ' + config.DB_USER +
  ' DB: ' + config.DB_NAME
);

/**
 * Execute an SQL-query.
 * @param text - SQL-query
 * @param params - An array of strings inserted to the query.
 * @example
 * db.query('SELECT * FROM table WHERE id = $1', [id])
 * @returns Results of the query as a row of Javascript-objects.
 */
const query = async (text, params) => {
  const result = await pool.query(text, params);
  return result;
};

/**
 * Closes the pool.
 * @example
 * db.close()
 */
const close = async () => {
  await pool.end();
};

module.exports = { query, close };

