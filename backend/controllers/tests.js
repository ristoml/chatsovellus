const router = require('express').Router();
const bcrypt = require('bcrypt');

const createRouter = (pool) => {
  router.post('/resetusers', async (_request, response) => {
    pool.query('DELETE FROM users');
    response.status(204).end();
  });

  router.post('/addtestuser', async (_request, response) => {
    const testPass = 'secret';
    const saltRounds = 10;
    const hash = await bcrypt.hash(testPass, saltRounds);

    pool.query('INSERT INTO users (username, realname, passwordhash, type) VALUES ($1, $2, $3, $4)',
      ['root', 'root', hash, 'admin']);

    response.status(204).end();
  });

  return router;
};

module.exports = createRouter;

