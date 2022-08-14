const requireSocket = require('socket.io');

let io;

module.exports = {
  init: (httpServer) => {
    io = requireSocket(httpServer);
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error('Socket.io not initalized');
    }
    return io;
  },
};
