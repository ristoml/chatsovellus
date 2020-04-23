const bcrypt = require('bcrypt');
const db     = require('../db');
const jwt    = require('jsonwebtoken');
const router = require('express').Router();

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Log in
 *     description: Responds with a json web token, if authentication is successful. All fields required.
 *     tags: [Login]
 *     parameters:
 *      - in: body
 *        name: credentials
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                username:
 *                  type: string
 *                password:
 *                  type: string
 *        example:
 *          username: mattivirtanen
 *          password: salasana123
 *     responses:
 *       '200':
 *         description: Successful login
 *       '400':
 *         description: Any required field missing.
 *       '401':
 *         description: Unauthorized access. Incorrect password.
 *       '404':
 *         description: User does not exist
 */
router.post('/', async (request, response, next) => {
  const { username, password } = request.body;

  if (!username) {
    return response.status(400).json({ error: 'Username missing.' });
  }
  if (!password) {
    return response.status(400).json({ error: 'Password missing.' });
  }

  const usernameTrimmed = username.trim();
  const passwordTrimmed = password.trim();

  if (usernameTrimmed.length === 0) {
    return response.status(400).json({ error: 'Username missing.' });
  }
  if (passwordTrimmed.length === 0) {
    return response.status(400).json({ error: 'Password missing.' });
  }

  try {
    const query =
        await db
          .query('SELECT username, passwordhash, type FROM users WHERE username = $1', [usernameTrimmed]);

    if (query.rows.length === 0) {
      return response.status(404).json({ error: 'User does not exist.' });
    }
    const user = query.rows[0];

    const passwdMatches = await bcrypt.compare(passwordTrimmed, user.passwordhash);
    if (!passwdMatches) {
      return response.status(401).json({ error: 'Incorrect password.' });
    }

    const userForToken = { username: usernameTrimmed, type: user.type };
    const token = jwt.sign(userForToken, process.env.SECRET);

    response.status(200).send({ username: user.username, token });
  } catch (except) {
    next(except);
  }
});

module.exports = router;
