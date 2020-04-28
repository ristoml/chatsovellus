const socketio = require('socket.io');

const sockets = {};

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

    socket.on('new-message', (message) => {
      if (typeof message !== 'string') {
        socket.emit(
          'error',
          `ERROR: expected a string but was ${typeof message} for event new-message.`
        );
        return;
      }
      const youmsg = 'You: ' + message;
      socket.emit('new-message', youmsg);
      socket.broadcast.emit('new-message', message);
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
};

module.exports = init;





