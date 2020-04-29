const db     = require('../db');
const jwt    = require('jsonwebtoken');
const router = require('express').Router();

router.get('/', async (request, response, next) => {
  try {
    const query =
      await db.query(
        'SELECT users.username, message, created FROM messages '
        + 'INNER JOIN users ON messages.userid = users.id '
        + 'ORDER BY created DESC',
      );

    const rows = query.rows.map(({ username, message, created }) => {
      return { username, message, created };
    });

    response
      .status(200)
      .json(rows);
  } catch (except) {
    next(except);
  }
});

router.post('/', async (request, response, next) => {
  const { message } = request.body;
  const { token } = request;

  if (!message) {
    return response.status(400).json({ error: 'Missing field: \'message\'' });
  }

  try {
    const decodedToken = await jwt.verify(token, process.env.SECRET);

    if (!decodedToken.username || !decodedToken.type) {
      return response.status(401).json({ error: 'invalid token' });
    }
    const date = new Date();
    const [ m, d, y ] = date.toLocaleDateString().split('/');
    const time = date.toTimeString().split(' ')[0];

    const { id } = decodedToken;
    const created = `${y}-${m}-${d} ${time}`;

    await db.query(
      'INSERT INTO messages (userid, message, created) VALUES ($1, $2, $3)',
      [id, message, created]
    );
    response.status(201).end();
  } catch (except) {
    next(except);
  }
});

module.exports = router;
