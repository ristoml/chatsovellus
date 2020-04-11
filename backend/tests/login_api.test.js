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

  test('if user does not exist, expect 404', async () => {
    const res = await api.post({ username: 'doesnotexist', password: 'gwjoegwjoiegw223' }).expect(404);
    expect(res.body.error).toMatch(/user does not exist/i);
  });

  test('missing username should yield a proper error message', async () => {
    const res1 = await api.post({ ...initialUser, username: undefined }).expect(400);
    const res2 = await api.post({ ...initialUser, username: '' }).expect(400);
    const res3 = await api.post({ ...initialUser, username: '                   ' }).expect(400);
    expect(res1.body.error).toMatch(/username missing/i);
    expect(res2.body.error).toMatch(/username missing/i);
    expect(res3.body.error).toMatch(/username missing/i);
  });

  test('missing password should yield a proper error message', async () => {
    const res1 = await api.post({ ...initialUser, password: undefined }).expect(400);
    const res2 = await api.post({ ...initialUser, password: '' }).expect(400);
    const res3 = await api.post({ ...initialUser, password: '                   ' }).expect(400);
    expect(res1.body.error).toMatch(/password missing/i);
    expect(res2.body.error).toMatch(/password missing/i);
    expect(res3.body.error).toMatch(/password missing/i);
  });
});

afterAll(async () => {
  await pool.end();
});
