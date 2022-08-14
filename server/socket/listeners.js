const io = require('./index').getIO();
const clients = require('./Clients');
const {
  getData,
  updateAlarm,
  updateDefusal,
  updateStreak
} = require('../controller');

module.exports = (app) => {
  const getTime = () => new Date().toLocaleTimeString();

  // let alarmTime;
  // let isDisarmed;
  // let streak;
  io.on('connection', (socket) => {
    // INITAILIZE SESSION
    clients.add(socket.id.cut(), getTime());
    console.log('Current Clients:', clients.List);
    socket.on('connect', () => { });
    socket.on('disconnecting', () => { });

    socket.on('disconnect', () => {
      // const clientNum = clients.getNum(socket.id);
      console.log(`${socket.id.cut()} has disconnected`);
      clients.remove(socket.id.cut());
      console.log('Clients remaining: ', clients.List);
      console.log('_');
    });

    // ALARM TIME
    socket.on('get-alarm-time', () => {
      getData(null, null, { source: 'alarmtime' }, (alarmTime) => {
        io.emit('got-alarm-time', alarmTime);
      });
    });
    socket.on('update-alarm-time', (time) => {
      console.log('updating alarm to:', time);
      updateAlarm(null, null, { data: time }, (result) => {
        io.emit('updated-alarm-time', result);
      });
    });

    // DEFUSE VALUE
    socket.on('get-defuse', () => {
      getData(null, null, { source: 'isdefused' }, (defuseValue) => {
        io.emit('got-defuse-value', defuseValue);
      });
    });
    socket.on('update-defuse', (value) => {
      updateDefusal(null, null, { data: value }, (result) => {
        io.emit('updated-defuse-value', result);
      });
    });

    // STREAK VALUE
    socket.on('get-streak', () => {
      getData(null, null, { source: 'streakcount' }, (streak) => {
        io.emit('got-streak-value', streak);
      });
    });
    socket.on('update-streak', (value) => {
      console.log('updating streak to:', value);
      updateStreak(null, null, { data: value }, (result) => {
        io.emit('updated-streak-value', result);
      });
    });
  });
};
