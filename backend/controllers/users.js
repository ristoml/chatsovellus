const bcrypt = require('bcrypt');
const db     = require('../db');
const jwt    = require('jsonwebtoken');
const router = require('express').Router();

/**
 * @swagger
 * /api/users:
 *  get:
 *    summary: Get all users
 *    tags: [Users]
 *    description: Request all users from the server.
 *    responses:
 *      '200':
 *        description: All users as an array of javascript objects
 */
router.get('/', async (request, response, next) => {
  try {
    const query = await db.query('SELECT * FROM users ORDER BY id ASC');

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

/**
 * @swagger
 * path:
 *  /api/users/{userId}:
 *    get:
 *      summary: Get a user by id
 *      tags: [Users]
 *      parameters:
 *        - in: path
 *          name: userId
 *          schema:
 *            type: integer
 *          required: true
 *          description: Id of the user
 *      responses:
 *        "200":
 *          description: User as an object
 *        "404":
 *          description: User not found.
 */
router.get('/:id', async (request, response, next) => {
  const id = request.params.id;
  try {
    const query = await db.query('SELECT * FROM users WHERE id = $1', [id]);

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

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Post a new user to the database.
 *     description: Post a new user to the database. All fields are required.
 *     tags: [Users]
 *     parameters:
 *      - in: body
 *        name: user
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                username:
 *                  type: string
 *                realname:
 *                  type: string
 *                password:
 *                  type: string
 *                type:
 *                  type: string
 *        example:   # Sample object
 *          username: mattivirtanen
 *          realname: Matti Virtanen
 *          password: salasana123
 *          type: admin
 *     responses:
 *       '201':
 *         description: User succesfully created.
 *       '400':
 *         description: Any required field missing.
 */
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

  const [ passTrimmed, usernameTrimmed, realnameTrimmed, typeTrimmed ] =
    [ password.trim(), username.trim(), realname.trim(), type.trim() ];

  if (passTrimmed.length === 0) {
    return response.status(400).json({ error: 'Password is required.' });
  }
  if (usernameTrimmed.length === 0) {
    return response.status(400).json({ error: 'Username is required.' });
  }
  if (realnameTrimmed.length === 0) {
    return response.status(400).json({ error: 'Real name is required.' });
  }
  if (typeTrimmed.length === 0) {
    return response.status(400).json({ error: 'User type is required.' });
  }

  if (!['admin', 'user'].includes(typeTrimmed)) {
    return response.status(400).json({ error: 'Not a proper user type.' });
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
    await db
      .query(
        'INSERT INTO users (username, realname, passwordHash, type) VALUES ($1, $2, $3, $4)',
        [username, realname, hash, type]
      );

    response.status(201).send('User created');
  } catch (except) {
    next(except);
  }
});

router.delete('/', async (request, response, next) => {
  const { userToDelete } = request.body;
  const token = request.token;

  try {
    const decodedToken = await jwt.verify(token, process.env.SECRET);

    if (!decodedToken.username || !decodedToken.type) {
      return response.status(401).json({ error: 'invalid token' });
    }

    if (decodedToken.type !== 'admin') {
      return response.status(401).json({ error: 'User does not have permission to delete other users from the database.' });
    }

    await db.query('DELETE FROM users WHERE username = $1', [userToDelete]);
    response.status(204).end();
  } catch (except) {
    next(except);
  }
});

module.exports = router;
