const { Temporal } = require('@js-temporal/polyfill');
const { watchLED, runPump } = require('./gpio').helpers;
const {
  convert,
  getTime,
} = require('./utils');
const {
  getAlarmTimeData,
  getDisarmStatus,
  getStreakCount,
  getSocket,
} = require('./resources');

const failsafe = false;

// const toggleTOD = (time) => { const tod = time.tod(); const newTime = time.slice(0, -2); return newTime + (tod === 'AM' ? 'PM' : 'AM'); };

const currTime = () => Temporal.Now.plainTimeISO().toLocaleString();
console.log(currTime(), getTime());

const getAlarmTime = () => {
  const time = getAlarmTimeData();
  return convert(new Temporal.PlainTime((time[0].hour === 24 ? 0 : time[0].hour), time[0].minute));
};

const resetStreak = () => {
  getSocket().emit('update-streak-count', 0);
};
const updateDefusal = () => {
  const status = getDisarmStatus() ? 1 : 0;
  getSocket().emit('update-disarm-status', status);
};
const incrementStreak = () => {
  getSocket().emit('update-streak-count', getStreakCount() += 1);
};

const successfulStreak = () => {
  updateDefusal();
  incrementStreak();
};

const runAlarm = () => {
  // failedStreak = true;
  runPump('test'); // test == Yellow LED, remove for pump running.
  // initiateStreakFailure(); // runs on the red LED for 20hrs
  resetStreak();
};

const test = () => {
  console.log(getAlarmTime());
  console.log(getDisarmStatus());
  console.log(getStreakCount());
  console.log(getAlarmTime());
};

// activateRedLED();
const Clock = () => {
  const intervalObj = setInterval(() => { // begin interval
    watchLED(getDisarmStatus());
    if (currTime().secUnit() === '0') console.log('isDisarmed: ', getDisarmStatus());
    if (currTime().secUnit() === '0') test();
    // if (currTime().secUnit() === 0) console.log(`\ncurrTime:${currTime()}\nalarmTime: ${alarmTime}n\failedStreak: ${failedStreak} \nisDisarmed: ${isDisarmed} streak: ${streakCount}`);
    if (currTime() === getAlarmTime() && !getDisarmStatus()) runAlarm(); // Handle alarm
    if (currTime() === getAlarmTime() && getDisarmStatus()) successfulStreak(); // Handle streak++
    if (failsafe) { // check if somethings broke, disable interval
      clearInterval(intervalObj);
    }
  }, 1000);
};

module.exports = {
  Clock,
  getAlarmTime,
};
