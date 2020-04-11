const router = require('express').Router();
const bcrypt = require('bcrypt');

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
    if (!username) {
      return response.status(400).json({ error: 'Username is required.' });
    }
    if (!realname) {
      return response.status(400).json({ error: 'Real name is required.' });
    }
    if (!type) {
      return response.status(400).json({ error: 'User type is required.' });
    }

    const passTrimmed = password.trim();
    const usernameTrimmed = username.trim();
    const realnameTrimmed = realname.trim();
    const typeTrimmed = type.trim();

    if (passTrimmed.length === 0) {
      return response.status(400).json({ error: 'Password is required.' });
    }
    if (usernameTrimmed.length === 0) {
      return response.status(400).json({
        error: 'Username is required.'
      });
    }
    if (realnameTrimmed.length === 0) {
      return response.status(400).json({
        error: 'Real name is required.'
      });
    }
    if (typeTrimmed.length === 0) {
      return response.status(400).json({
        error: 'User type is required.'
      });
    }

    if (!['admin', 'user'].includes(typeTrimmed)) {
      return response.status(400).json({
        error: 'Not a proper user type.'
      });
    }
    if (passTrimmed.length < 8) {
      return response.status(400).json({ error: 'Password length should be at least 8 characters long.' });
    }
    if (passTrimmed.length < 16 && !/[0-9]+/.test(passTrimmed)) {
      return response.status(400).json({
        error: 'Password shorter than 16 characters should contain at least one digit.'
      });
    }
    if (passTrimmed.length < 16 && !/[a-z]+/.test(passTrimmed)) {
      return response.status(400).json({
        error: 'Password shorter than 16 characters should contain at least one lowercase letter.'
      });
    }
    if (usernameTrimmed.length < 5) {
      return response.status(400).json({
        error: 'Username should be at least 5 characters long.'
      });
    }
    if (realnameTrimmed.length < 5) {
      return response.status(400).json({
        error: 'Real name should be at least 5 characters long.'
      });
    }

    const saltRounds = 10;
    const hash = await bcrypt.hash(passTrimmed, saltRounds);

    try {
      await pool
        .query(
          'INSERT INTO users (username, realname, passwordHash, type) VALUES ($1, $2, $3, $4)',
          [username, realname, hash, type]
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
