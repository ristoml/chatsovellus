const config = require('../utils/config');

const Pool = require('pg').Pool;
const pool = new Pool({
  user: config.DB_USER,
  host: 'localhost',
  database: config.DB_NAME,
  password: config.DB_PASSWORD,
  port: 5432
});

console.log('Pool created. User: ', config.DB_USER, ' DB: ',config.DB_NAME);

module.exports = {
  query: async (text, params) => {
    const result = await pool.query(text, params);
    return result;
  },
  close: async () => {
    await pool.end();
  }
};

