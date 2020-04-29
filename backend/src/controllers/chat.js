const db     = require('../db');
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

module.exports = router;
