const socketio = require('socket.io');

const sockets = {};

const init = (server) => {
  const io = socketio(server);

  io.on('connection', (socket) => {
    sockets[socket.id] = socket;
    console.log(`socket ${socket.id} connected`);

    socket.on('new-user', () => {
      io.emit('user-list', Object.keys(sockets));
    });

    socket.on('new-message', (message) => {
      socket.broadcast.emit('new-message', message);
    });

    socket.on('disconnect', () => {
      io.emit('user-list', Object.keys(sockets));
      console.log(`socket ${socket.id} disconnected`);
      delete sockets[socket.id];
    });
  });
};

module.exports = init;





