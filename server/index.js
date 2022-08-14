const app = require('express')();
const env = require('dotenv').config().parsed;
const http = require('http').Server(app);

const { PORT } = env;
http.listen(PORT, () => console.log(`listening to *:${PORT}`));

// app.get('/', (req, res) => res.send('pung')); // TEST

const io = require('./socket').init(http, {
  cors: '*',
});

io.on('connection', (socket) => {
  console.log('_');
  console.log(socket.id.cut(), 'connected!');
});

require('./socket/listeners')(app);
