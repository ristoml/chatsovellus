const supertest = require('supertest');
const app = require('../src/app');
const api = supertest(app);
const db = require('../src/db');

describe('When there is initially one user in the database', () => {

  beforeEach(async () => {
    await api.post('/api/tests/reset');
    await api.post('/api/tests/adduserandmessages');
  });

  test('messages are returned as JSON', async () => {
    await api
      .get('/api/chat')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

});

afterAll(async () => {
  await db.close();
});

