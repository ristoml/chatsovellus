const supertest = require('supertest');
const app = require('../src/app');
const api = supertest(app);
const db = require('../src/db');

describe('When there is initially one user in the database', () => {

  beforeEach(async () => {
    await api.post('/api/tests/reset');
    await api.post('/api/tests/adduserandmessages');
  });

  test('messages are returned as JSON and contain necessary properties', async () => {
    const response = await api
      .get('/api/chat')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    response.body.forEach((m) => {
      expect(m.message).toBeDefined();
      expect(m.created).toBeDefined();
      expect(m.username).toBeDefined();
    });
  });

});

afterAll(async () => {
  await db.close();
});

