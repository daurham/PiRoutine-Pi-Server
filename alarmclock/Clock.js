/**
 * This Clock is continuously running and is considered
 *  the brain of PiRoutine.
 *
 * It compares the current time with the user's selected alarmtime
 *  and automatically triggers the Pi's actions based on if
 *  the alarm has been disarmed or not.
 */

const { watchLED, runPump } = require('./gpio');
const { theCurrentTime } = require('./utils');
const {
  getAlarmData,
  getDisarmStatus,
  getStreakCount,
  getSocket,
} = require('./resources');

// Resouces - Readability
const failsafe = false;
const isDisarmed = () => getDisarmStatus();
const streakCount = () => getStreakCount();
const socket = () => getSocket();
const alarm1 = () => getAlarmData().alarmTime1;
const alarm2 = () => getAlarmData().alarmTime2;
const tenSecAfterAlarm1 = () => getAlarmData().tenSecIntoAlarm1;

// Update Resources
const resetStreak = () => {
  socket().emit('update-streak-count', 0);
};
const toggleDisarmStatus = () => {
  const status = !(isDisarmed() === true);
  socket().emit('update-disarm-status', status);
};
const incrementStreak = () => {
  socket().emit('update-streak-count', streakCount() + 1);
};

// Actions
const successfulStreak = () => {
  toggleDisarmStatus();
  incrementStreak();
};
const runAlarm = () => {
  runPump('test'); // test == Yellow LED, remove arg to enable pump.
  resetStreak();
  // initiateStreakFailure(); // runs on the red LED for 20hrs
};

const test = () => {
  console.log('__TEST__');
  console.log('alarmtime1', alarm1());
  console.log('alarmtime2', alarm2());
  console.log('10SecAfterAlarmTime', tenSecAfterAlarm1());
  console.log('isDisarmed', isDisarmed());
  // console.log('streak', getStreakCount());
  // console.log('resetStreak', getStreakCount());
  // console.log('Increment Streak', incrementStreak());
  // console.log('Run Pump', runPump('test'));
  // console.log('Run Alarm', runAlarm());
  console.log('__TEST__');
};

// activateRedLED();
const Clock = () => {
  const intervalObj = setInterval(() => { // begin interval
    watchLED(isDisarmed());
    // Test Values
    if (theCurrentTime().slice(-4, -3) === '0') test();
    // Run Pump
    if (theCurrentTime() === alarm1() && !isDisarmed()) runAlarm();
    // Initiate Phase 2
    if (theCurrentTime() === tenSecAfterAlarm1() && isDisarmed()) toggleDisarmStatus();
    // Run Pump
    if (theCurrentTime() === alarm2() && !isDisarmed()) runAlarm();
    // Handle Streak++ & Reset
    if (theCurrentTime() === alarm2() && isDisarmed()) successfulStreak(); // Handle streak++
    if (failsafe) { // check if somethings broke, disable interval
      clearInterval(intervalObj);
    }
  }, 1000);
};

module.exports = {
  Clock,
};
