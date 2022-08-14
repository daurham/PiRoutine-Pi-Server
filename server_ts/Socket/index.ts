let io: any;

export = {
  init: (httpServer: any) => {
    io = require('socket.io')(httpServer);
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error('Socket.io not initalized'); 
    } 
    return io;
  }
};