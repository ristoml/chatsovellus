const supertest = require('supertest');
const { app, pool } = require('../app');
const api = supertest(app);

const userWithoutPass = {
  username: 'testuser',
  realname: 'matti',
  type: 'user'
};

const initialUserWithoutPass = {
  username: 'root',
  realname: 'root',
  type: 'admin'
};

beforeAll(() => {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error(
      `NODE_ENV should be set to 'development'. It is currently set to ${process.env.NODE_ENV}.`
    );
  }
});

describe('When there is initially one user in the database', () => {
  beforeEach(async () => {
    await api.post('/api/tests/resetusers');
    await api.post('/api/tests/addtestuser');
  });

  test('a new user with correct properties can be added to the database', async () => {
    const usersBefore = await api.get('/api/users');
    const rowsBefore = usersBefore.body;

    const newUser = {
      password: 'abcd123!',
      ...userWithoutPass
    };

    await api.post('/api/users').send(newUser).expect(201);

    const usersAfter = await api.get('/api/users');
    const rowsAfter = usersAfter.body;

    expect(rowsAfter.length).toBe(rowsBefore.length + 1);
    expect(rowsAfter.map((u) => u.username)).toContain('testuser');
    expect(rowsAfter.map((u) => u.username)).toContain('root');

    expect(rowsAfter).toEqual(
      expect.arrayContaining([
        expect.objectContaining(userWithoutPass)
      ])
    );

    expect(rowsAfter).toEqual(
      expect.arrayContaining([
        expect.objectContaining(initialUserWithoutPass)
      ])
    );
  });

  test('user without a proper password cannot be added to the database', async () => {
    const tooShort = {
      password: 'abcdef7',
      ...userWithoutPass
    };
    const noDigits = {
      password: 'hhffguhgfgh',
      ...userWithoutPass
    };
    const noLowerCaseLetters = {
      password: '123223982',
      ...userWithoutPass
    };

    const res1 = await api.post('/api/users').send(userWithoutPass).expect(400);
    const res2 = await api.post('/api/users').send(tooShort).expect(400);
    const res3 = await api.post('/api/users').send(noDigits).expect(400);
    const res4 = await api.post('/api/users').send(noLowerCaseLetters).expect(400);

    expect(res1.body.error).toMatch(/password is required/i);
    expect(res2.body.error).toMatch(/password length should be at least 8 characters long/i);
    expect(res3.body.error).toMatch(/password shorter than 16 characters should contain at least one digit/i);
    expect(res4.body.error).toMatch(/password shorter than 16 characters should contain at least one lowercase letter/i);
  });
});


afterAll(async () => {
  await pool.end();
});


