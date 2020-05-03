const supertest = require('supertest');
const app = require('../src/app');
const api = supertest(app);
const db = require('../src/db');

const userWithoutPass = {
  username: 'testuser',
  realname: 'matti',
  type: 'user'
};

describe('When there is initially one user in the database', () => {
  beforeEach(async () => {
    await api.post('/api/tests/reset');
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

    const userOfTypeUser = {
      username: 'anotheruser',
      realname: 'Kalevi',
      type: 'user',
      password: 'abcd123!',
    };

    await api.post('/api/users').send(userOfTypeUser).expect(201);

    const usersAfter2 = await api.get('/api/users');
    const rowsAfter2 = usersAfter2.body;

    expect(rowsAfter2.length).toBe(rowsBefore.length + 2);
    expect(rowsAfter2.map((u) => u.username)).toContain('testuser');
    expect(rowsAfter2.map((u) => u.username)).toContain('root');
    expect(rowsAfter2.map((u) => u.username)).toContain('anotheruser');
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
    const onlyWhiteSpace = {
      password: '                 ',
      ...userWithoutPass
    };

    const res1 = await api.post('/api/users').send(userWithoutPass).expect(400);
    const res2 = await api.post('/api/users').send(tooShort).expect(400);
    const res3 = await api.post('/api/users').send(noDigits).expect(400);
    const res4 = await api.post('/api/users').send(noLowerCaseLetters).expect(400);
    const res5 = await api.post('/api/users').send(onlyWhiteSpace).expect(400);

    expect(res1.body.error).toMatch(/password is required/i);
    expect(res2.body.error).toMatch(/password length should be at least 8 characters long/i);
    expect(res3.body.error).toMatch(/password shorter than 16 characters should contain at least one digit/i);
    expect(res4.body.error).toMatch(/password shorter than 16 characters should contain at least one lowercase letter/i);
    expect(res5.body.error).toMatch(/password is required/i);
  });

  test('user without a username cannot be added', async () => {
    const noUserName = {
      ...userWithoutPass,
      password: '2383289382932892389ugrg',
      username: undefined
    };
    const onlyWhiteSpace = {
      ...userWithoutPass,
      password: '2383289382932892389ugrg',
      username: '                               '
    };
    const lessThanFiveChars = {
      ...userWithoutPass,
      password: '2383289382932892389ugrg',
      username: 'abcd'
    };

    const res1 = await api.post('/api/users').send(noUserName).expect(400);
    const res2 = await api.post('/api/users').send(onlyWhiteSpace).expect(400);
    const res3 = await api.post('/api/users').send(lessThanFiveChars).expect(400);
    expect(res1.body.error).toMatch(/username is required/i);
    expect(res2.body.error).toMatch(/username is required/i);
    expect(res3.body.error).toMatch(/username should be at least 5 characters long/i);
  });

  test('user without a real name cannot be added', async () => {
    const noUserName = {
      ...userWithoutPass,
      password: '2383289382932892389ugrg',
      realname: undefined
    };
    const onlyWhiteSpace = {
      ...userWithoutPass,
      password: '2383289382932892389ugrg',
      realname: '                               '
    };
    const lessThanFiveChars = {
      ...userWithoutPass,
      password: '2383289382932892389ugrg',
      realname: 'abcd'
    };

    const res1 = await api.post('/api/users').send(noUserName).expect(400);
    const res2 = await api.post('/api/users').send(onlyWhiteSpace).expect(400);
    const res3 = await api.post('/api/users').send(lessThanFiveChars).expect(400);
    expect(res1.body.error).toMatch(/real name is required/i);
    expect(res2.body.error).toMatch(/real name is required/i);
    expect(res3.body.error).toMatch(/real name should be at least 5 characters long/i);
  });

  test('user without a proper user type cannot be added', async () => {
    const noType = {
      ...userWithoutPass,
      password: '2383289382932892389ugrg',
      type: undefined
    };
    const notProperType1 = {
      ...userWithoutPass,
      password: '2383289382932892389ugrg',
      type: '                               '
    };
    const notProperType2 = {
      ...userWithoutPass,
      password: '2383289382932892389ugrg',
      type: 'abcd'
    };

    const res1 = await api.post('/api/users').send(noType).expect(400);
    const res2 = await api.post('/api/users').send(notProperType1).expect(400);
    const res3 = await api.post('/api/users').send(notProperType2).expect(400);
    expect(res1.body.error).toMatch(/user type is required/i);
    expect(res2.body.error).toMatch(/user type is required/i);
    expect(res3.body.error).toMatch(/not a proper user type/i);
  });

  test('user\'s password hash should not be revealed in server response', async () => {
    const response =
      await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/);

    response.body.forEach((u) => expect(u.passwordhash).not.toBeDefined());
  });

});

describe('When there are a few users in the database', () => {
  const adminUser = {
    username: 'user1',
    realname: 'user1',
    password: 'testpass1',
    type: 'admin'
  };

  const nonAdmin = {
    username: 'user4',
    realname: 'user4',
    password: 'testpass4',
    type: 'user'
  };

  beforeEach(async () => {
    await api.post('/api/tests/resetusers');
    await api.post('/api/tests/addsometestusers');
  });

  test('user\'s password hash should not be revealed in server response', async () => {
    const response =
      await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/);

    response.body.forEach((u) => expect(u.passwordhash).not.toBeDefined());
  });

  test('user\'s of type admin can delete a user\'s from the database', async () => {
    const login = await api.post('/api/login').send(adminUser).expect(200);
    const { token } = login.body;

    const userToDelete = {
      userToDelete: nonAdmin.username,
    };

    await api
      .delete('/api/users')
      .send(userToDelete)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);
  });

  test('user\'s of type \'user\' cannot delete a user from the database', async () => {
    const login = await api.post('/api/login').send(nonAdmin).expect(200);
    const { token } = login.body;

    const userToDelete = {
      userToDelete: adminUser.username,
    };

    const res =
      await api
        .delete('/api/users')
        .send(userToDelete)
        .set('Authorization', `Bearer ${token}`)
        .expect(401);

    expect(res.body.error).toMatch(/user does not have permission to delete other users from the database/i);
  });

  test('cannot delete a user with an invalid token', async () => {
    const userToDelete = {
      userToDelete: nonAdmin.username,
    };

    const res =
      await api
        .delete('/api/users')
        .send(userToDelete)
        .set('Authorization', 'Bearer malformedtoken')
        .expect(401);

    expect(res.body.error).toMatch(/invalid token/i);
  });
});

afterAll(async () => {
  await db.close();
});

