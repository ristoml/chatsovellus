const db = require('../db');
const socketio = require('socket.io');
const { dateString, dateForDb } = require('../utils/helpers');

const sockets = {};

const handleMessage = async (socket, data) => {
  const { id, username, message } = data;
  const now = new Date();
  const created = dateForDb(now);

  await db.query(
    'INSERT INTO messages (userid, message, created) VALUES ($1, $2, $3)',
    [id, message, created]
  );

  const msg = { created: dateString(now), message };
  await socket.emit('newMessage', { ...msg, username: 'You' });
  await socket.broadcast.emit('newMessage', { ...msg, username });
};

const init = (server) => {
  const io = socketio(server);

  io.on('connection', (socket) => {
    console.log(`socket ${socket.id} connected`);

    socket.on('newUser', (username) => {
      if (typeof username !== 'string') {
        socket.emit(
          'error',
          `ERROR: expected a string but was ${typeof message} for event 'newUser'.`
        );
        return;
      }
      sockets[socket.id] = { socket, username };
      const users =
        Object.values(sockets)
          .map((v) => v.username);

      const now = new Date();
      const youmsg = { username: 'You', created: dateString(now), message: 'joined' };
      const usrmsg = { username, created: dateString(now), message: 'joined' };

      socket.emit('userList', { message: youmsg, users });
      socket.broadcast.emit('userList', { message: usrmsg, users });
    });

    socket.on('newMessage', async (data) => {
      if (typeof data !== 'object') {
        socket.emit(
          'error',
          `expected an object but was ${typeof data} for event 'newMessage'.`
        );
        return;
      }
      const { id, username, message } = data;
      if (!id) {
        socket.emit('error', 'missing id');
        return;
      }
      if (!message) {
        socket.emit('error', 'missing message');
        return;
      }
      if (!username) {
        socket.emit('error', 'missing username');
        return;
      }
      await handleMessage(socket, data);
    });

    socket.on('disconnect', () => {
      console.log(`socket ${socket.id} disconnected`);
      const username = sockets[sockets.id].username;
      delete sockets[socket.id];

      const users =
        Object.values(sockets)
          .map((v) => v.username);

      const now = new Date();
      const message = { username, created: dateString(now), message: 'joined' };
      socket.broadcast.emit('userList', { message, users });
    });
  });

  return io;
};

module.exports = init;
