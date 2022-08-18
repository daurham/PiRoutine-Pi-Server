const axios = require('axios');
const io = require('./socket/index').getIO();
const clients = require('./socket/Clients');
const {
  getData,
  updateAlarm,
  updateDisarmStatus,
  updateStreak,
} = require('./controller');

module.exports = (app, express) => {
  const getTime = () => new Date().toLocaleTimeString();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  io.on('connection', (socket) => {
    // INITAILIZE SESSION
    clients.add(socket.id.cut(), getTime());
    console.log('Current Clients:', clients.List);
    socket.on('connect', () => { });
    socket.on('disconnecting', () => { });

    socket.on('disconnect', () => {
      console.log(`${socket.id.cut()} has disconnected`);
      clients.remove(socket.id.cut());
      // console.log('Clients remaining: ', clients.List);
      // console.log('_');
    });

    // ALARM TIME
    // get
    socket.on('get-alarm-time', () => {
      getData(null, null, { table: 'alarmtime' }, (alarmTime) => {
        io.emit('got-alarm-time', alarmTime);
      });
    });
    app.get('/get-alarm-time/', (req, res) => getData(req, res));

    // update
    socket.on('update-alarm-time', (newAlarmTime) => {
      console.log('updating alarm to:', newAlarmTime);
      updateAlarm(null, null, { data: newAlarmTime }, async (updatedAlarmTime) => {
        // UPDATE CLIENT
        try {
          io.emit('updated-alarm-time', updatedAlarmTime);
          await axios.get('https://piroutine.com/get-alarrm-update');
        } catch (err) {
          console.log('Error notifying client to update alarm', err);
        }
      });
    });
    app.patch('/update-alarm-time', (req, res) => {
      console.log('update data:', req.body);
      // { hour: #, minute: #, tod: string }
      updateAlarm(req, res, null, (updatedAlarmTime) => {
        io.emit('updated-alarm-time', updatedAlarmTime);
      });
    });

    // DISARM STATUS
    // get
    socket.on('get-disarm-status', () => {
      getData(null, null, { table: 'isdisarmed' }, (disarmStatus) => {
        io.emit('got-disarm-status', disarmStatus);
      });
    });
    app.get('/get-disarm-status/', (req, res) => getData(req, res));

    // update
    socket.on('update-disarm-status', (newStatus) => {
      updateDisarmStatus(null, null, { data: newStatus }, async (updatedStatus) => {
        // UPDATE CLIENT
        try {
          io.emit('updated-disarm-status', updatedStatus);
          await axios.get('https://piroutine.com/get-disarm-update');
        } catch (err) {
          console.log('Error notifying client to update disarm', err);
        }
      });
    });
    app.patch('/update-disarm-status', (req, res) => {
      updateDisarmStatus(req, res, null, (updatedStatus) => {
        io.emit('updated-disarm-status', updatedStatus);
      });
    });

    // STREAK COUNT
    // get
    socket.on('get-streak-count', () => {
      getData(null, null, { table: 'streakcount' }, (streakCount) => {
        io.emit('got-streak-count', streakCount);
      });
    });
    app.get('/get-streak-count/', (req, res) => getData(req, res));

    // update
    socket.on('update-streak-count', (newStreakCount) => {
      console.log('updating streak to:', newStreakCount);
      updateStreak(null, null, { data: newStreakCount }, async (updatedStreakCount) => {
        // UPDATE CLIENT
        try {
          io.emit('updated-streak-count', updatedStreakCount);
          await axios.get('https://piroutine.com/get-streak-update');
        } catch (err) {
          console.log('Error notifying client to update streak', err);
        }
      });
    });
    app.patch('/update-streak-count', (req, res) => {
      updateStreak(req, res, null, (updatedStreakCount) => {
        io.emit('updated-streak-count', updatedStreakCount);
      });
    });
  });
};
