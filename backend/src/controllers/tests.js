const bcrypt = require('bcrypt');
const db     = require('../db');
const router = require('express').Router();
const { dateForDb } = require('../utils/helpers');

router.post('/adduserandmessages', async (_request, response, next) => {
  const testPass = 'secret';
  const saltRounds = 10;
  const hash = await bcrypt.hash(testPass, saltRounds);

  await db.query('INSERT INTO users (username, realname, passwordhash, type) VALUES ($1, $2, $3, $4)',
    ['someuser', 'user', hash, 'admin']);

  const res = await db.query('SELECT id, username FROM users WHERE username = $1', ['someuser']);
  const { id } = res.rows[0];

  const promiseArray = [ 'message1', 'message2', 'message3', 'message4' ].map((message) => {
    const promise = async () => {
      const created = dateForDb(new Date());
      await db.query(
        'INSERT INTO messages (userid, message, created) VALUES ($1, $2, $3)',
        [id, message, created]
      );
    };
    return promise();
  });

  try {
    await Promise.all(promiseArray);
    response.status(204).end();
  } catch (expect) {
    next(expect);
  }
});

router.post('/reset', async (_request, response) => {
  await db.query('DELETE FROM messages');
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
    const addUserPromise = async () => {
      const saltRounds = 10;
      const hash = await bcrypt.hash(u.password, saltRounds);
      await db.query(
        'INSERT INTO users (username, realname, passwordhash, type) VALUES ($1, $2, $3, $4)',
        [u.username, u.realname, hash, u.type]
      );
    };

    return addUserPromise();
  });

  try {
    await Promise.all(promiseArray);
    response.status(204).end();
  } catch (expect) {
    next(expect);
  }
});

module.exports = router;

