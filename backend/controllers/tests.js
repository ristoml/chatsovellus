const bcrypt = require('bcrypt');
const db     = require('../db');
const router = require('express').Router();

router.post('/resetusers', async (_request, response) => {
  db.query('DELETE FROM users');
  response.status(204).end();
});

router.post('/addtestuser', async (_request, response) => {
  const testPass = 'secret';
  const saltRounds = 10;
  const hash = await bcrypt.hash(testPass, saltRounds);

  db.query('INSERT INTO users (username, realname, passwordhash, type) VALUES ($1, $2, $3, $4)',
    ['root', 'root', hash, 'admin']);

  response.status(204).end();
});

module.exports = router;

