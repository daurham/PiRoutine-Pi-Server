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
let stoppingClock = false;
const isDisarmed = () => getDisarmStatus();
const streakCount = () => getStreakCount();
const socket = () => getSocket();
const alarm1 = () => getAlarmData().alarmTime1;
const alarm2 = () => getAlarmData().alarmTime2;
const aFewSecIntoAlarm1 = () => getAlarmData().aFewSecIntoAlarm1;

// Update Resources
const resetStreak = () => {
  socket().emit('update-streak-count', 0);
};
const toggleDisarmStatus = () => {
  const status = !(isDisarmed() === true);
  console.log('toggleing to: ', status);
  socket().emit('update-disarm-status', status);
};
const incrementStreak = () => {
  socket().emit('update-streak-count', streakCount() + 1);
};

// Actions
const successfulStreak = () => {
  console.log('SUCCESSS!!!!', isDisarmed());
  toggleDisarmStatus();
  incrementStreak();
  setTimeout(() => console.log('after..?', isDisarmed()), 1000);
};
const runAlarm = (test) => {
  resetStreak();
  runPump(test); // test == Yellow LED, remove arg to enable pump.
  // initiateStreakFailure(); // runs on the red LED for 20hrs
};

const checkTestFunctionality = (
  isTest,
  alarmOne = alarm1(),
  alarmTwo = alarm2(),
  fewSecIntoAlarmOne = aFewSecIntoAlarm1(),
) => {
  if (theCurrentTime() === alarmOne && !isDisarmed()) runAlarm(isTest);
  // Initiate Phase 2
  if (theCurrentTime() === fewSecIntoAlarmOne && isDisarmed()) toggleDisarmStatus();
  // Run Pump
  if (theCurrentTime() === alarmTwo && !isDisarmed()) runAlarm(isTest);
  // Handle Streak++ & Reset
  if (theCurrentTime() === alarmTwo && isDisarmed()) successfulStreak();
  // VALUE & FUNCTION CHECK:

  console.log('|>>->_TEST_RUNNING--->>>>>');
  // console.log(theCurrentTime());
  // console.log('alarmtime1', alarm1());
  // console.log('alarmtime2', alarm2());
  // console.log('10SecAfterAlarmTime', aFewSecIntoAlarm1());
  // console.log('isDisarmed', isDisarmed());
  // console.log('streak', streakCount());
  // console.log('resetStreak', getStreakCount());
  // console.log('Increment Streak', incrementStreak());
  // console.log('Run Pump', runPump('test'));
  // console.log('Run Alarm', runAlarm());
  console.log('<-<<__TEST_RUNNING---<<<<<|');
};

// const checkMainFunctionality = () => {}; // TODO Optimize refactor with DRY

const Clock = ({
  isTest,
  noPump,
  reasonToStop,
  clockCallback,
}) => {
  // Initiate Clock
  const intervalObj = setInterval(() => {
    // Makes sure LED activity represents DisarmStatus
    watchLED(isDisarmed());

    // Check for any reason to stop Clock
    if (!stoppingClock) {
      if (reasonToStop) stoppingClock = reasonToStop();
    }

    // Safely Test
    if (isTest) {
      const { alarmOne, alarmTwo, fewSecIntoAlarmOne } = isTest;
      checkTestFunctionality(!!isTest, alarmOne, alarmTwo, fewSecIntoAlarmOne);
    } else {
      /**
       * Here are the conditions the Clock checks every second.
       *  The options passed in will affect the features.
       */

      // Defaults:
      // Handle Alarm1 Failure:
      if (theCurrentTime() === alarm1() && !isDisarmed()) runAlarm(noPump);
      // Initiate Phase 2
      if (theCurrentTime() === aFewSecIntoAlarm1() && isDisarmed()) toggleDisarmStatus();
      // Handle Alarm2 Failure:
      if (theCurrentTime() === alarm2() && !isDisarmed()) runAlarm(noPump);
      // Handle Streak++ & Reset
      if (theCurrentTime() === alarm2() && isDisarmed()) successfulStreak();
    }

    // Check if need to stop Clock
    if (stoppingClock) {
      clearInterval(intervalObj);
      if (clockCallback) clockCallback();
    }
  }, 1000);
};

module.exports = {
  Clock,
  alarm1,
  alarm2,
  isDisarmed,
  aFewSecIntoAlarm1,
  socket,
  streakCount,
};
