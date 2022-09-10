// const io = require('../socket/index').getIO();
// const clients = require('../socket/Clients');
// const {
//   getData,
//   updateData,
//   // updateDisarmStatus,
//   // updateStreak,
//   postData,
//   // updateSkippedCount,
//   // updateSkippedDate,
//   // updateSoakedCount,
// } = require('../controller');

// module.exports = (app, express) => {
//   const getTime = () => new Date().toLocaleTimeString();

//   app.use(express.urlencoded({ extended: true }));
//   app.use(express.json());

//   io.on('connection', (socket) => {
//     // INITAILIZE SESSION
//     clients.add(socket.id.cut(), getTime());
//     console.log('Current Clients:', clients.List);
//     socket.on('connect', () => { });
//     socket.on('disconnecting', () => { });

//     socket.on('disconnect', () => {
//       console.log(`${socket.id.cut()} has disconnected`);
//       clients.remove(socket.id.cut());
//     });

//     socket.on();
//   });
// };
