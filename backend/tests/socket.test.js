const db       = require('../src/db');
const http     = require('http');
const ioClient = require('socket.io-client');
const ioServer = require('../src/socket');

describe('When a client connect to the server', () => {
  let app, server, io, client, api, id, username;
  const options = {
    'force new connection': true
  };

  beforeEach(async (done) => {
    const supertest = require('supertest');
    app    = require('../src/app');
    server = http.createServer(app);
    io     = ioServer(server);
    api    = supertest(server);

    const serverAddr = server.listen().address();

    await api.post('/api/tests/reset');
    await api.post('/api/tests/addtestuser');
    const res = await api.post('/api/login').send({ username: 'root', password: 'secret' });
    id = res.body.id;
    username = res.body.username;

    client = await ioClient.connect(
      `http://[${serverAddr.address}]:${serverAddr.port}`,
      options
    );

    client.on('connect', () => {
      console.log('client connected');
      done();
    });
    client.on('disconnect', () => {
      console.log('client disconnected');
    });
  });

  afterEach(async () => {
    await client.close();
    await io.close();
  });

  test('a user list is received, when sending username with \'newUser\'-event', async (done) => {
    await client.emit('newUser', 'matti');

    client.on('userList', (data) => {
      expect(data).toBeDefined();
      expect(data.users).toContain('matti');
      done();
    });
  });

  test('client and server transfer messages between each other', async (done) => {
    await client.emit('newUser', 'matti');
    const msg = { id, username, message: 'hello world' };
    await client.emit('newMessage', msg);

    client.on('newMessage', (msg) => {
      expect(msg.username).toBe('You');
      expect(msg.message).toBe('hello world');
      expect(msg.created).toBeDefined();
      done();
    });
  });
});

afterAll(async () => {
  await db.close();
});
