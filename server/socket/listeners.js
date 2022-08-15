const axios = require('axios');
const io = require('./index').getIO();
const clients = require('./Clients');
const {
  getData,
  updateAlarm,
  updateDisarmStatus,
  updateStreak,
} = require('../controller');

module.exports = (app) => {
  const getTime = () => new Date().toLocaleTimeString();

  io.on('connection', (socket) => {
    // INITAILIZE SESSION
    clients.add(socket.id.cut(), getTime());
    console.log('Current Clients:', clients.List);
    socket.on('connect', () => { });
    socket.on('disconnecting', () => { });

    socket.on('disconnect', () => {
      console.log(`${socket.id.cut()} has disconnected`);
      clients.remove(socket.id.cut());
      console.log('Clients remaining: ', clients.List);
      console.log('_');
    });

    // ALARM TIME
    // get
    socket.on('get-alarm-time', () => {
      getData(null, null, { table: 'alarmtime' }, (alarmTime) => {
        io.emit('got-alarm-time', alarmTime);
      });
    });
    app.get('/get-alarm-time/:table', getData);

    // update
    socket.on('update-alarm-time', (newAlarmTime) => {
      console.log('updating alarm to:', newAlarmTime);
      updateAlarm(null, null, { data: newAlarmTime }, async (updatedAlarmTime) => {
        // UPDATE CLIENT
        try {
          io.emit('updated-alarm-time', updatedAlarmTime);
          await axios.get('https://www.piroutine.com/get-alarrm-update');
        } catch (err) {
          console.log('Error notifying client to update alarm', err);
        }
      });
    });
    app.patch('/update-alarm-time/:hour/:minute/:tod', (req, res) => {
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
    app.get('/get-disarm-status/:table', getData);

    // update
    socket.on('update-disarm-status', (newStatus) => {
      updateDisarmStatus(null, null, { data: newStatus }, async (updatedStatus) => {
        // UPDATE CLIENT
        try {
          io.emit('updated-disarm-status', updatedStatus);
          await axios.get('https://www.piroutine.com/get-disarm-update');
        } catch (err) {
          console.log('Error notifying client to update disarm', err);
        }
      });
    });
    app.patch('/update-disarm-status/:newStatus', (req, res) => {
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
    app.get('/get-streak-count/:table', getData);

    // update
    socket.on('update-streak-count', (newStreakCount) => {
      console.log('updating streak to:', newStreakCount);
      updateStreak(null, null, { data: newStreakCount }, async (updatedStreakCount) => {
        // UPDATE CLIENT
        try {
          io.emit('updated-streak-count', updatedStreakCount);
          await axios.get('https://www.piroutine.com/get-streak-update');
        } catch (err) {
          console.log('Error notifying client to update streak', err);
        }
      });
    });
    app.patch('/update-streak-count/:newStreak', (req, res) => {
      updateStreak(req, res, null, (updatedStreakCount) => {
        io.emit('updated-streak-count', updatedStreakCount);
      });
    });
  });
};
