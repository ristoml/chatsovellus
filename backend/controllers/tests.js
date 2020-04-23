const bcrypt = require('bcrypt');
const db     = require('../db');
const router = require('express').Router();

router.post('/resetusers', async (_request, response) => {
  await db.query('DELETE FROM users');
  response.status(204).end();
});

router.post('/addtestuser', async (_request, response) => {
  const testPass = 'secret';
  const saltRounds = 10;
  const hash = await bcrypt.hash(testPass, saltRounds);

  await db.query('INSERT INTO users (username, realname, passwordhash, type) VALUES ($1, $2, $3, $4)',
    ['root', 'root', hash, 'admin']);

  response.status(204).end();
});

router.post('/addsometestusers', async (_request, response, next) => {
  const users = [
    {
      username: 'user1',
      realname: 'user1',
      password: 'testpass1',
      type: 'admin'
    },
    {
      username: 'user2',
      realname: 'user2',
      password: 'testpass2',
      type: 'admin'
    },
    {
      username: 'user3',
      realname: 'user3',
      password: 'testpass3',
      type: 'admin'
    },
    {
      username: 'user4',
      realname: 'user4',
      password: 'testpass4',
      type: 'user'
    },
    {
      username: 'user5',
      realname: 'user5',
      password: 'testpass5',
      type: 'user'
    },
  ];

  const promiseArray = users.map((u) => {
    const saltRounds = 10;

    return bcrypt.hash(u.password, saltRounds)
      .then((hash) => {
        db.query(
          'INSERT INTO users (username, realname, passwordhash, type) VALUES ($1, $2, $3, $4)',
          [u.username, u.realname, hash, u.type]
        );
      });
  });

  try {
    await Promise.all(promiseArray);
    response.status(204).end();
  } catch (expect) {
    next(expect);
  }
});

module.exports = router;

