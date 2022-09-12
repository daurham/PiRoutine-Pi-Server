const env = require('dotenv').config().parsed;
const express = require('express');
require('./socket/Clients');

const app = express();
const http = require('http').Server(app);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const { PORT } = env;

const io = require('./socket').init(http, {
  cors: '*',
});

io.on('connection', (socket) => {
  console.log('');
  console.log('Client', socket.id.cut(), 'connected!');
});

http.listen(PORT, () => console.log(`listening to *:${PORT}`));
require('./listeners')(app);
