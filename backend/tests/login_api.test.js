const supertest = require('supertest');
const { app, pool } = require('../app');
const api = supertest(app);

const initialUser = {
  username: 'root',
  realname: 'root',
  type: 'admin',
  password: 'secret'
};

beforeAll(async () => {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error(
      `NODE_ENV should be set to 'development'. It is currently set to ${process.env.NODE_ENV}.`
    );
  }
  
  await api.post('/api/tests/resetusers');
  await api.post('/api/tests/addtestuser');
});

describe('When there is initially one user in the database', () => {
  test('user with correct password can log in.', async () => {
    const response = await api.post(initialUser).expect(200);
    expect(response.body.token).toBeDefined();
  });

  test('user with incorrect password cannot log in.', async () => {
    await api.post({ ...initialUser, password: 'incorrect pass' }).expect(401);
  });
});

afterAll(async () => {
  await pool.end();
});
