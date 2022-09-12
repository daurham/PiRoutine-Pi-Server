const io = require('../socket/index').getIO();
const {
  updateData,
} = require('../controller');
const { EVENTS } = require('../socket');

module.exports = (app) => {
  io.on('connection', (socket) => {
    // UPDATE ALARM TIME
    app.patch('/update-alarm-time', (req, res) => { // { hour: #, minute: #, tod: string }
      updateData(req, res, {
        alarmclock: false,
        data: req.body,
        table: 'alarmtime',
        column: ['hour', 'minute', 'tod'],
      }, (updatedAlarmTime) => {
        io.emit(EVENTS.UPDATED_ALARM_TIME, updatedAlarmTime);
      });
    });
    //

    // UPDATE DISARM STATUS
    socket.on(EVENTS.UPDATE_DISARM_STATUS, (newStatus) => {
      updateData(null, null, {
        alarmclock: true,
        data: newStatus,
        table: 'isdisarmed',
        column: ['disarmedstatus'],
      }, (updatedStatus) => {
        io.emit(EVENTS.UPDATED_DISARM_STATUS, updatedStatus);
      });
    });
    app.patch('/update-disarm-status', (req, res) => {
      updateData(req, res, {
        alarmclock: false,
        data: req.body.data,
        table: 'isdisarmed',
        column: ['disarmedstatus'],
      }, (updatedStatus) => {
        io.emit(EVENTS.UPDATED_DISARM_STATUS, updatedStatus);
      });
    });
    //

    // UPDATE STREAK DATA
    socket.on(EVENTS.UPDATE_STREAK_DATA, (newStreakCount) => {
      // console.log('updating streak to:', newStreakCount);
      updateData(null, null, {
        alarmclock: true,
        data: newStreakCount,
        table: 'streakcount',
        column: ['streak', 'maxstreak'],
      }, (updatedStreakCount) => {
        io.emit(EVENTS.UPDATED_STREAK_DATA, updatedStreakCount);
      });
    });
    //

    // UPDATE SOAKED COUNT
    socket.on(EVENTS.UPDATE_SOAKED_COUNT, (newCount) => {
      updateData(null, null, {
        data: newCount,
        alarmclock: true,
        table: 'soakedcount',
        column: ['soaked'],
      }, (updatedCount) => {
        io.emit(EVENTS.UPDATED_SOAKED_COUNT, updatedCount);
      });
    });
    //

    // UPDATE SKIPPED COUNT
    socket.on(EVENTS.UPDATE_SKIPPED_DATA, (newSkippedCount) => {
      // console.log('updating skipped to:', newSkippedCount);
      updateData(null, null, {
        alarmclock: true,
        data: newSkippedCount,
        table: 'skippedcount',
        column: ['skipped', 'skipdate'],
      }, (updatedSkippedCount) => {
        io.emit(EVENTS.UPDATED_SKIPPED_DATA, updatedSkippedCount);
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
        io.emit(EVENTS.UPDATED_SKIPPED_DATA, updatedSkippedDate);
      });
    });
  });
};
