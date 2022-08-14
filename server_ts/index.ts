const express = require('express');
const path = require('path');
const env = require('dotenv').config().parsed;
const app = express();
// const { createProxyMiddleware } = require('http-proxy-middleware');

const PORT = env.PORT || 3000;
const URL = env.URL || 'localhost';
// const DIST = path.join(__dirname, '../client/dist');
let server;

// const wsProxy = createProxyMiddleware('http://localhost:8080/socket.io', { changeOrigin: true });
// app.use(wsProxy);
require('./setupProxy')(app);


console.log('f');
// app.use(express.static());



// if (env.NODE_ENV === 'development') {
  /* Runs Locally */
  // console.log('in development @ port', PORT)
  // server = app.listen(PORT, () => console.log(`Listening to http://${URL}:${PORT}`));
  // require('./setupProxy')(app);
  // app.listen(PORT, () => console.log(`Listening to http://${URL}:${PORT}`));
  server = require('http').createServer(app);
  server.listen(PORT)
// } else {
  /* Runs Deployed */
  // app.listen(PORT, () => console.log(`Listening to http://${URL}:${PORT}`));
  // server = require('http').createServer();
// }


const io = require('./Socket/index').init(server, {
  cors: {
    origin: '*',
  },
});



io.on('connection', (socket: any) => {
  console.log(`Client ${socket.id.cut()} connected`);
});


require('./Socket/listeners');

export {};