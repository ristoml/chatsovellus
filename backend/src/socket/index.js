const db       = require('../db');
const socketio = require('socket.io');

const sockets = {};

const handleMessage = async (socket, data) => {
  const { id, username, message } = data;

  const date = new Date();
  const [ m, d, y ] = date.toLocaleDateString().split('/');
  const time = date.toTimeString().split(' ')[0];

  const created = `${y}-${m}-${d} ${time}`;

  await db.query(
    'INSERT INTO messages (userid, message, created) VALUES ($1, $2, $3)',
    [id, message, created]
  );

  const youmsg = 'You: ' + message;
  const msg = `${username}: ${message}`;
  await socket.emit('new-message', youmsg);
  await socket.broadcast.emit('new-message', msg);
};

const init = (server) => {
  const io = socketio(server);

  io.on('connection', (socket) => {
    console.log(`socket ${socket.id} connected`);

    socket.on('new-user', (username) => {
      if (typeof username !== 'string') {
        socket.emit(
          'error',
          `ERROR: expected a string but was ${typeof message} for event 'new-user'.`
        );
        return;
      }
      sockets[socket.id] = { socket, username };
      const users =
        Object.values(sockets)
          .map((v) => v.username);

      io.emit('user-list', users);
    });

    socket.on('new-message', async (data) => {
      if (typeof data !== 'object') {
        socket.emit(
          'error',
          `expected an object but was ${typeof data} for event new-message.`
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
      delete sockets[socket.id];

      const users =
        Object.values(sockets)
          .map((v) => v.username);

      io.emit('user-list', users);
    });
  });

  return io;
};

module.exports = init;





