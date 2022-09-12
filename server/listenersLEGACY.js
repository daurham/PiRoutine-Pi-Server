const io = require('./socket/index').getIO();
const clients = require('./socket/Clients');
const {
  getData,
  updateData,
  // updateDisarmStatus,
  // updateStreak,
  postData,
  // updateSkippedCount,
  // updateSkippedDate,
  // updateSoakedCount,
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
    });

    // GET ALARM TIME
    socket.on('get-alarm-time', () => {
      getData(null, null, {
        alarmclock: true,
        table: 'alarmtime',
        column: ['hour', 'minute', 'tod'],
      }, (alarmTime) => {
        io.emit('got-alarm-time', alarmTime);
      });
    });
    app.get('/get-alarm-time/', (req, res) => {
      getData(req, res, {
        alarmclock: false,
        table: 'alarmtime',
        column: ['hour', 'minute', 'tod'],
      });
    });
    // UPDATE ALARM TIME
    app.patch('/update-alarm-time', (req, res) => { // { hour: #, minute: #, tod: string }
      updateData(req, res, {
        alarmclock: false,
        data: req.body,
        table: 'alarmtime',
        column: ['hour', 'minute', 'tod'],
      }, (updatedAlarmTime) => {
        io.emit('updated-alarm-time', updatedAlarmTime);
      });
    });

    // GET DISARM STATUS
    socket.on('get-disarm-status', () => {
      getData(null, null, {
        alarmclock: true,
        table: 'isdisarmed',
        column: ['disarmedstatus'],
      }, (disarmStatus) => {
        io.emit('got-disarm-status', disarmStatus);
      });
    });
    app.get('/get-disarm-status/', (req, res) => {
      getData(req, res, {
        alarmclock: false,
        table: 'isdisarmed',
        column: ['disarmedstatus'],
      });
    });
    // UPDATE DISARM STATUS
    socket.on('update-disarm-status', (newStatus) => {
      updateData(null, null, {
        alarmclock: true,
        data: newStatus,
        table: 'isdisarmed',
        column: ['disarmedstatus'],
      }, (updatedStatus) => {
        io.emit('updated-disarm-status', updatedStatus);
      });
    });
    app.patch('/update-disarm-status', (req, res) => {
      updateData(req, res, {
        alarmclock: false,
        data: req.body.data,
        table: 'isdisarmed',
        column: ['disarmedstatus'],
      }, (updatedStatus) => {
        io.emit('updated-disarm-status', updatedStatus);
      });
    });

    // GET STREAK COUNT
    socket.on('get-streak-count', () => {
      getData(null, null, {
        alarmclock: true,
        table: 'streakcount',
        column: ['streak', 'maxstreak'],
      }, (streakCount) => {
        io.emit('got-streak-count', streakCount);
      });
    });
    app.get('/get-streak-count/', (req, res) => {
      getData(req, res, {
        alarmclock: false,
        table: 'streakcount',
        column: ['streak', 'maxstreak'],
      });
    });
    // UPDATE STREAK COUNT
    socket.on('update-streak-count', (newStreakCount) => {
      // console.log('updating streak to:', newStreakCount);
      updateData(null, null, {
        alarmclock: true,
        data: newStreakCount,
        table: 'streakcount',
        column: ['streak', 'maxstreak'],
      }, (updatedStreakCount) => {
        io.emit('updated-streak-count', updatedStreakCount);
      });
    });

    // GET USER INFO
    socket.on('get-user-info', () => {
      getData(null, null, {
        alarmclock: true,
        table: 'users',
        column: ['username', 'password_'],
      }, (usersRes) => {
        io.emit('got-user-info', usersRes);
      });
    });
    app.get('/get-user-info/', (req, res) => {
      getData(req, res, {
        alarmclock: false,
        table: 'users',
        column: ['username', 'password_'],
      });
    });

    // GET SOAKED COUNT
    socket.on('get-soaked-count', () => {
      getData(null, null, {
        alarmclock: true,
        table: 'soakedcount',
        column: ['soaked'],
      }, (soakedCount) => {
        io.emit('got-soaked-count', soakedCount);
      });
    });
    app.get('/get-soaked-count/', (req, res) => {
      getData(req, res, {
        alarmclock: false,
        table: 'soakedcount',
        column: ['soaked'],
      });
    });
    // UPDATE SOAKED COUNT
    socket.on('update-soaked-count', (newCount) => {
      updateData(null, null, {
        data: newCount,
        alarmclock: true,
        table: 'soakedcount',
        column: ['soaked'],
      }, (updatedCount) => {
        io.emit('updated-soaked-count', updatedCount);
      });
    });

    // GET SKIPPED DATA
    socket.on('get-skipped-data', () => {
      getData(null, null, {
        alarmclock: true,
        table: 'skippedcount',
        column: ['skipped', 'skipdate'],
      }, (skippedData) => {
        // console.log('skipped?:', skippedData);
        io.emit('got-skipped-data', skippedData);
      });
    });
    app.get('/get-skipped-data/', (req, res) => {
      getData(req, res, {
        alarmclock: false,
        table: 'skippedcount',
        column: ['skipped', 'skipdate'],
      });
    });
    // UPDATE SKIPPED COUNT
    socket.on('update-skipped-count', (newSkippedCount) => {
      // console.log('updating skipped to:', newSkippedCount);
      updateData(null, null, {
        alarmclock: true,
        data: newSkippedCount,
        table: 'skippedcount',
        column: ['skipped', 'skipdate'],
      }, (updatedSkippedCount) => {
        io.emit('updated-skipped-count', updatedSkippedCount);
      });
    });

    // UPDATE SKIPPED DATE - CLIENT ONLY
    app.patch('/update-skipped-date', (req, res) => { // { date: 'mm/dd/yyyy' }
      // console.log('Skipping: ', req.body.data);
      updateData(req, res, {
        alarmclock: false,
        data: req.body.data,
        table: 'skippedcount',
        column: ['skipped', 'skipdate'],
      }, (updatedSkippedDate) => {
        io.emit('updated-skipped-date', updatedSkippedDate);
      });
    });

    // GET DISARM RECORDS
    socket.on('post-disarm-record', (disarmRecord) => {
      // console.log('Recieved data to post from AlarmClock Client:', disarmRecord);
      postData(disarmRecord);
    });
    app.get('/get-disarm-records/', (req, res) => {
      getData(req, res, {
        alarmclock: false,
        table: 'disarmrecords',
        column: ['date_', 'alarm1', 'alarm2', 'disarmedtime1', 'disarmedtime2', 'success', 'username'],
      });
    });
  });
};
