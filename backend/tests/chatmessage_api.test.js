const supertest = require('supertest');
const app = require('../src/app');
const api = supertest(app);
const db = require('../src/db');

const testuser = { username: 'root', password: 'secret' };

describe('When there is initially one user in the database', () => {
  let token = null;

  beforeEach(async () => {
    await api.post('/api/tests/reset');
    await api.post('/api/tests/addtestuser');

    const res =
      await api.post('/api/login').send(testuser);

    token = res.body.token;
  });

  test('user can post a message if logged in', async () => {
    const msg = {
      message: 'test message',
      token
    };
    await api.post('/api/chat')
      .send(msg)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);

    const response =
      await api.get('/api/chat')
        .expect(200)
        .expect('Content-Type', /application\/json/);

    const messages = response.body;
    expect(messages.length).toBe(1);
    const row = messages.find((m) => m.message === 'test message');
    expect(row).toBeDefined();
    expect(row.username).toBe('root');
    expect(row.created).toMatch(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/);
  });

  test('user can not post a message if not logged in', async () => {
    const msg = {
      message: 'test message',
      token: 'malformedtoken'
    };
    const response =
      await api.post('/api/chat')
        .send(msg)
        .set('Authorization', `Bearer ${msg.malformedtoken}`)
        .expect(401);

    expect(response.body.error).toMatch(/invalid token/i);
  });
});

afterAll(async () => {
  await db.close();
});

