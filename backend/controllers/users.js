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
    const { name, realname, password, type } = request.body;

    try {
      await pool
        .query(
          'INSERT INTO users (username, realname, passwordHash, type) VALUES ($1, $2, $3, $4)',
          [name, realname, password, type]
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
