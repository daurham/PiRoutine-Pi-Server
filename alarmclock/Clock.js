/**
 * This Clock is continuously running and is considered
 *  the brain of PiRoutine.
 *
 * It compares the current time with the user's selected alarmtime
 *  and automatically triggers the Pi's actions based on if
 *  the alarm has been disarmed or not.
 */

const { watchLED, runPump } = require('./gpio');
const { theCurrentTime, getPhase } = require('./utils');
const {
  getAlarmData,
  getDisarmStatus,
  getStreakCount,
  getSocket,
} = require('./resources');
const {
  postDisarmRecord,
  setDisarmTime1,
  setDisarmTime2,
  setAlarm1,
  setAlarm2,
  setSuccess,
  setUsername,
} = require('./logDisarmRecords');

// Resouces - Readability
let currentPhase = 1;
let stoppingClock = false;
const isDisarmed = () => getDisarmStatus();
const streakCount = () => getStreakCount();
const socket = () => getSocket();
let alarm1 = () => getAlarmData().alarmTime1;
let alarm2 = () => getAlarmData().alarmTime2;
let aFewSecIntoAlarm1 = () => getAlarmData().aFewSecIntoAlarm1;
let aFewSecIntoAlarm2 = () => getAlarmData().aFewSecIntoAlarm2;
const soakedCount = () => getAlarmData().soakedCount;
const skippedCount = () => getAlarmData().skippedCount;
const skipThisDate = () => getAlarmData().skipDate;

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
const incrementDaysSkipped = () => {
  console.log('SKIPPING A DAY');
  socket().emit('update-skipped-count', skippedCount() + 1);
};
const incrementDaysSoaked = () => {
  socket().emit('update-soaked-count', soakedCount() + 1);
};

// Actions
const bypassAlarm = () => {
  console.log('______succeeded to disarm');
  setSuccess(1);
  toggleDisarmStatus();
  incrementStreak();
  setTimeout(() => console.log('after..?', isDisarmed()), 1000);
};
const runAlarm = (test, alarmNum) => {
  console.log('______failed to disarm');
  resetStreak();
  if (!test) incrementDaysSoaked();
  runPump(test); // test == Yellow LED, remove arg to enable pump.
  setSuccess(0);
  if (alarmNum === 1) setDisarmTime1(null);
  if (alarmNum === 2) setDisarmTime2(null);
  // initiateStreakFailure(); // runs on the red LED for 20hrs
};

const checkTestLogs = () => {
  console.log('|>>->_TEST_RUNNING--->>>>>');
  // console.log(theCurrentTime());
  console.log('alarmtime1', alarm1());
  console.log('alarmtime2', alarm2());
  console.log('fewSecAfterAlarm1Time', aFewSecIntoAlarm1());
  console.log('fewSecAfterAlarm2Time', aFewSecIntoAlarm2());
  console.log('isDisarmed', isDisarmed());
  console.log('streak', streakCount());
  console.log('skipThisDate', skipThisDate());
  // console.log('resetStreak', getStreakCount());
  // console.log('Increment Streak', incrementStreak());
  // console.log('Run Pump', runPump('test'));
  // console.log('Run Alarm', runAlarm());
  console.log('<-<<__TEST_RUNNING---<<<<<|');
};

/**
 *
 * @param {ClockOptions} param
 * interface clockOptions {
  * isTest: Boolean,
  * noPump: Boolean,
  * reasonToStop: Function: Boolean,
  * clockCallBack: Function (Run after Clock stops),
 * }
 */
const Clock = ({
  isTest,
  noPump,
  reasonToStop,
  clockCallback,
}) => {
  if (noPump) console.log('pump deactiviated');

  let pumpSetting = noPump;
  let storedIsDisarmed;
  let storedDisarmTime1;
  let storedDisarmTime2;
  let storedStreak;
  let storedAlarm1;
  let storedAlarm2;
  let storedPhase; // May not need
  let dataWasRecordedToday = false;
  let testValuesSet = false;
  let skipToday = false;
  let storedSkipCount; // SET UP
  let storedSoakCount; // SET UP

  // Initiate Clock
  const intervalObj = setInterval(() => {
    // Check for any reason to stop Clock
    if (!stoppingClock) {
      if (reasonToStop) stoppingClock = reasonToStop();
    }

    // Makes sure LED activity represents DisarmStatus
    watchLED(isDisarmed());

    // Determine If Todays Getting Skipped:
    if (new Date().toLocaleDateString() === skipThisDate()) {
      if (skipToday && theCurrentTime() === alarm1()) incrementDaysSkipped();
      if (!skipToday) {
        skipToday = true;
      }
    } else if (skipToday) {
      skipToday = false;
    }

    // Safely Test
    if (isTest) {
      if (!testValuesSet) {
        // Redefine Val Functions:
        alarm1 = () => isTest.alarmOne;
        alarm2 = () => isTest.alarmTwo;
        aFewSecIntoAlarm1 = () => isTest.fewSecIntoAlarmOne;
        aFewSecIntoAlarm2 = () => isTest.fewSecIntoAlarmTwo;
        pumpSetting = true;
        testValuesSet = true;
      }
    }

    // Set variables
    if (storedIsDisarmed === undefined) storedIsDisarmed = isDisarmed();
    if (storedStreak === undefined) storedStreak = streakCount();
    if (storedAlarm1 === undefined) storedAlarm1 = alarm1();
    if (storedAlarm2 === undefined) storedAlarm2 = alarm2();
    if (storedSkipCount === undefined) storedSkipCount = skippedCount(); // DOESNT EXIST
    if (storedSoakCount === undefined) storedSoakCount = soakedCount(); // DOESNT EXIST

    // Get CurrentPhase
    currentPhase = getPhase(alarm1(), alarm2(), theCurrentTime());
    if (storedPhase === undefined) storedPhase = currentPhase;

    // Check Main Clock Functionality

    // IF Record Keeping Data Isn't Defined:
    if (setAlarm1()) setAlarm1(alarm1());
    if (setAlarm2()) setAlarm2(alarm2());
    if (setUsername()) setUsername('daurham');

    // Handle when alarm1 changes
    if (storedAlarm1 !== alarm1()) {
      setAlarm1(alarm1());
      setAlarm2(alarm2());
      storedAlarm1 = alarm1();
      storedAlarm2 = alarm2();
    }

    if (currentPhase === 1 && !skipToday) {
      // Handle Alarm1 Failure:
      if (theCurrentTime() === alarm1() && !isDisarmed()) runAlarm(pumpSetting, 1);
      // Reset Daily Record Keeping
      if (dataWasRecordedToday) dataWasRecordedToday = false;
      // If Disarm Status Changes
      if (storedIsDisarmed !== isDisarmed()) {
        storedIsDisarmed = isDisarmed();
        // Monitor Disarm 1 Changes For Record Keeping
        if (isDisarmed() === true) {
          storedDisarmTime1 = theCurrentTime();
          setDisarmTime1(storedDisarmTime1);
        }
      }
      // Handle when time is changed into an earlier time -- skipping the alarm
      if (storedAlarm1 > theCurrentTime() && alarm1() < theCurrentTime()) {
        setDisarmTime1(null);
        setDisarmTime2(null);
        setAlarm1(alarm1());
        setAlarm2(alarm2());
        setSuccess(0);
        setUsername('daurham');
        setTimeout(() => postDisarmRecord(getSocket), 500);
        // Post record data & count this as a skip // SET UP
      }
    }

    if (currentPhase === 2) {
      if (theCurrentTime() === alarm2() && skipToday && !isDisarmed()) runAlarm(pumpSetting, 2);
      // Initiate Phase 2
      if (theCurrentTime() === aFewSecIntoAlarm1() && isDisarmed()) toggleDisarmStatus();
      // Handle Alarm2 Failure:
      if (theCurrentTime() === alarm2() && !isDisarmed()) runAlarm(pumpSetting, 2);
      // Handle Streak++ & Reset
      if (theCurrentTime() === alarm2() && isDisarmed()) bypassAlarm();
      // If Disarm Status Changes
      if (storedIsDisarmed !== isDisarmed()) {
        storedIsDisarmed = isDisarmed();
        // Monitor Disarm 2 Changes For Record Keeping
        if (isDisarmed() === true) {
          storedDisarmTime2 = theCurrentTime();
          setDisarmTime2(storedDisarmTime2);
        }
      }
    }

    if (currentPhase === 3) {
      if (theCurrentTime() === aFewSecIntoAlarm2()) {
        if (!dataWasRecordedToday) postDisarmRecord(getSocket);
      }
    }

    if (isTest) checkTestLogs();

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
