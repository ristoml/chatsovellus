const http = require('http');
const ioClient = require('socket.io-client');
const ioServer = require('../src/socket');

describe('When a client connect to the server', () => {
  let app, server, io, client;
  const options = {
    'force new connection': true
  };

  beforeEach((done) => {
    app    = require('../src/app');
    server = http.createServer(app);
    io     = ioServer(server);

    const serverAddr = server.listen().address();

    client = ioClient.connect(
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

  test('a user list is received, when sending username with \'new-user\'-event', (done) => {
    client.emit('new-user', 'matti');

    client.on('user-list', (users) => {
      expect(users).toBeDefined();
      expect(users).toContain('matti');
      done();
    });
  });

  test('client and server transfer messages between each other', (done) => {
    client.emit('new-message', 'hello world');

    client.on('new-message', (msg) => {
      expect(msg).toBe('You: hello world');
      done();
    });
  });
});
