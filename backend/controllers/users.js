const router = require('express').Router();

const createRouter = (pool) => {
  router.get('/', async (request, response, next) => {
    try {
      const query = await pool.query('SELECT * FROM users ORDER BY id ASC');

      const rows = query.rows.map((user) => {
        return {
          id: user.id,
          username: user.username,
          realname: user.realname,
          type: user.type
        };
      });

      response
        .status(200)
        .json(rows);
    } catch (except) {
      next(except);
    }
  });

  router.get('/:id', async (request, response, next) => {
    const id = request.params.id;
    try {
      const query = await pool.query('SELECT * FROM users WHERE id = $1', [id]);

      if (query.rows.length === 0) {
        response.status(404).json({ error: 'user does not exist' });
      } else {
        const user = {
          id: query.rows[0].id,
          username: query.rows[0].username,
          realname: query.rows[0].realname,
          type: query.rows[0].type
        };
        response.status(200).json(user);
      }
    } catch (except) {
      next(except);
    }
  });

  router.post('/', async (request, response, next) => {
    const { username, realname, password, type } = request.body;

    if (!password) {
      return response.status(400).json({ error: 'Password is required.' });
    }
    if (password.length < 8) {
      return response.status(400).json({ error: 'Password length should be at least 8 characters long.' });
    }
    if (password.length < 16 && !/[0-9]+/.test(password)) {
      return response.status(400).json({
        error: 'Password shorter than 16 characters should contain at least one digit.'
      });
    }
    if (password.length < 16 && !/[a-z]+/.test(password)) {
      return response.status(400).json({
        error: 'Password shorter than 16 characters should contain at least one lowercase letter.'
      });
    }

    try {
      await pool
        .query(
          'INSERT INTO users (username, realname, passwordHash, type) VALUES ($1, $2, $3, $4)',
          [username, realname, password, type]
        );

      response.status(201).send('User created');
    } catch (except) {
      next(except);
    }
  });

  router.delete('/:id', async (request, response, next) => {
    try {
      const id = parseInt(request.params.id);
      await pool.query('DELETE FROM users WHERE id = $1', [id]);

      response.status(200).send(`User with ${id} deleted.`);
    } catch (except) {
      next(except);
    }
  });

  return router;
};

module.exports = createRouter;
