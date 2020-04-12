const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const db = require('../db');

const initialUser = {
  username: 'root',
  realname: 'root',
  type: 'admin',
  password: 'secret'
};

beforeAll(async () => {
  await api.post('/api/tests/resetusers');
  await api.post('/api/tests/addtestuser');
});

describe('When there is initially one user in the database', () => {
  test('user with correct password can log in.', async () => {
    const res = await api.post('/api/login').send(initialUser).expect(200);
    expect(res.body.token).toBeDefined();
  });

  test('user with incorrect password cannot log in.', async () => {
    const res = await api.post('/api/login').send({ ...initialUser, password: 'incorrect pass' }).expect(401);
    expect(res.body.token).not.toBeDefined();
    expect(res.body.error).toMatch(/incorrect password/i);
  });

  test('if user does not exist, expect 404', async () => {
    const res = await api.post('/api/login').send({ username: 'doesnotexist', password: 'gwjoegwjoiegw223' }).expect(404);
    expect(res.body.error).toMatch(/user does not exist/i);
  });

  test('missing username should yield a proper error message', async () => {
    const res1 = await api.post('/api/login').send({ ...initialUser, username: undefined }).expect(400);
    const res2 = await api.post('/api/login').send({ ...initialUser, username: '' }).expect(400);
    const res3 = await api.post('/api/login').send({ ...initialUser, username: '                   ' }).expect(400);
    expect(res1.body.error).toMatch(/username missing/i);
    expect(res2.body.error).toMatch(/username missing/i);
    expect(res3.body.error).toMatch(/username missing/i);
  });

  test('missing password should yield a proper error message', async () => {
    const res1 = await api.post('/api/login').send({ ...initialUser, password: undefined }).expect(400);
    const res2 = await api.post('/api/login').send({ ...initialUser, password: '' }).expect(400);
    const res3 = await api.post('/api/login').send({ ...initialUser, password: '                   ' }).expect(400);
    expect(res1.body.error).toMatch(/password missing/i);
    expect(res2.body.error).toMatch(/password missing/i);
    expect(res3.body.error).toMatch(/password missing/i);
  });
});

afterAll(async () => {
  await db.close();
});
