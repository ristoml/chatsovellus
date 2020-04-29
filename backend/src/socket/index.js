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

        socket.on('new-message', (data) => {
            if (typeof data !== 'object') {
                socket.emit(
                    'error',
                    `ERROR: expected an object but was ${typeof data} for event new-message.`
                );
                return;
            }
            console.log(data);
            const { username, message } = data;

            if (!username) {
                socket.emit('error', 'missing username');
                return;
            }
            if (!message) {
                socket.emit('error', 'missing message');
                return;
            }
            const youmsg = 'You: ' + message;
            const msg = `${username}: ${message}`;
            socket.emit('new-message', youmsg);
            socket.broadcast.emit('new-message', msg);
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