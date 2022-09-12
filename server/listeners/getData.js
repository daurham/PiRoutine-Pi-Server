const io = require('../socket').getIO();
const { getData } = require('../controller');
const { EVENTS } = require('../socket');

module.exports = (app) => {
  io.on('connection', (socket) => {
    // GET ALARM TIME
    socket.on(EVENTS.GET_ALARM_TIME, () => {
      getData(null, null, {
        alarmclock: true,
        table: 'alarmtime',
        column: ['hour', 'minute', 'tod'],
      }, (alarmTime) => {
        io.emit(EVENTS.GOT_ALARM_TIME, alarmTime);
      });
    });
    app.get('/get-alarm-time/', (req, res) => {
      getData(req, res, {
        alarmclock: false,
        table: 'alarmtime',
        column: ['hour', 'minute', 'tod'],
      });
    });
    //

    // GET DISARM STATUS
    socket.on(EVENTS.GET_DISARM_STATUS, () => {
      getData(null, null, {
        alarmclock: true,
        table: 'isdisarmed',
        column: ['disarmedstatus'],
      }, (disarmStatus) => {
        io.emit(EVENTS.GOT_DISARM_STATUS, disarmStatus);
      });
    });
    app.get('/get-disarm-status/', (req, res) => {
      getData(req, res, {
        alarmclock: false,
        table: 'isdisarmed',
        column: ['disarmedstatus'],
      });
    });
    //

    // GET STREAK COUNT
    socket.on(EVENTS.GET_STREAK_DATA, () => {
      getData(null, null, {
        alarmclock: true,
        table: 'streakcount',
        column: ['streak', 'maxstreak'],
      }, (streakCount) => {
        io.emit(EVENTS.GOT_STREAK_DATA, streakCount);
      });
    });
    app.get('/get-streak-count/', (req, res) => {
      getData(req, res, {
        alarmclock: false,
        table: 'streakcount',
        column: ['streak', 'maxstreak'],
      });
    });
    //

    // GET USER INFO
    socket.on(EVENTS.GET_USER_DATA, () => {
      getData(null, null, {
        alarmclock: true,
        table: 'users',
        column: ['username', 'password_'],
      }, (usersRes) => {
        io.emit(EVENTS.GOT_USER_DATA, usersRes);
      });
    });
    app.get('/get-user-info/', (req, res) => {
      getData(req, res, {
        alarmclock: false,
        table: 'users',
        column: ['username', 'password_'],
      });
    });
    //

    // GET SOAKED COUNT
    socket.on(EVENTS.GET_SOAKED_COUNT, () => {
      getData(null, null, {
        alarmclock: true,
        table: 'soakedcount',
        column: ['soaked'],
      }, (soakedCount) => {
        io.emit(EVENTS.GOT_SOAKED_COUNT, soakedCount);
      });
    });
    app.get('/get-soaked-count/', (req, res) => {
      getData(req, res, {
        alarmclock: false,
        table: 'soakedcount',
        column: ['soaked'],
      });
    });
    //

    // GET SKIPPED DATA
    socket.on(EVENTS.GET_SKIPPED_DATA, () => {
      getData(null, null, {
        alarmclock: true,
        table: 'skippedcount',
        column: ['skipped', 'skipdate'],
      }, (skippedData) => {
        // console.log('skipped?:', skippedData);
        io.emit(EVENTS.GOT_SKIPPED_DATA, skippedData);
      });
    });
    app.get('/get-skipped-data/', (req, res) => {
      getData(req, res, {
        alarmclock: false,
        table: 'skippedcount',
        column: ['skipped', 'skipdate'],
      });
    });
    //

    // GET DISARM RECORDS
    app.get('/get-disarm-records/', (req, res) => {
      getData(req, res, {
        alarmclock: false,
        table: 'disarmrecords',
        column: ['date_', 'alarm1', 'alarm2', 'disarmedtime1', 'disarmedtime2', 'success', 'username'],
      });
    });
  });
};
