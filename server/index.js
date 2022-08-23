const env = require('dotenv').config().parsed;
const express = require('express');

const app = express();
const http = require('http').Server(app);

const { PORT } = env;

const io = require('./socket').init(http, {
  cors: '*',
});

io.on('connection', (socket) => {
  console.log('_');
  console.log(socket.id.cut(), 'connected!');
});

http.listen(PORT, () => console.log(`listening to *:${PORT}`));
require('./listeners')(app, express);

module.exports = { io };
