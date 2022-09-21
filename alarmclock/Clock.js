/**
 * This Clock is continuously running and is considered
 *  the brain of PiRoutine.
 *
 * It compares the current time with the user's selected alarmtime
 *  and automatically triggers the Pi's actions based on if
 *  the alarm has been disarmed or not.
 */

const { watchLED, runPump } = require('./gpio');
const {
  theCurrentTime,
  getPhase,
  checkTestLogs,
  EVENTS,
} = require('./utils');
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
} = require('./utils/logDisarmRecords');

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
  socket().emit(EVENTS.UPDATE_STREAK_DATA, 0);
};
const toggleDisarmStatus = () => {
  const status = !(isDisarmed() === true);
  console.log('toggleing to: ', status);
  socket().emit(EVENTS.UPDATE_DISARM_STATUS, status);
};
const incrementStreak = () => {
  socket().emit(EVENTS.UPDATE_STREAK_DATA, streakCount() + 1);
};
const incrementDaysSkipped = () => {
  console.log('SKIPPING A DAY');
  socket().emit(EVENTS.UPDATED_SKIPPED_DATA, skippedCount() + 1);
};
const incrementDaysSoaked = () => {
  socket().emit(EVENTS.UPDATE_SOAKED_COUNT, soakedCount() + 1);
};

// Actions
const bypassAlarm = (disarmedFormerAlarm, alarmNum) => {
  console.log('______succeeded to disarm alarm #', alarmNum);
  if (alarmNum === 1) {
    setSuccess(1);
    disarmedFormerAlarm(true);
  }
  if (alarmNum === 2 && disarmedFormerAlarm()) {
    incrementStreak();
    disarmedFormerAlarm(false); // Reset
  }
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
const testingTools = {
  alarm1,
  alarm2,
  aFewSecIntoAlarm1,
  aFewSecIntoAlarm2,
  isDisarmed,
  streakCount,
  skipThisDate,
};

/**
 *
 * @param {ClockOptions} param
 * interface clockOptions {
  * isTest: Boolean,
  * disablePump: Boolean,
  * reasonToStop: Function: Boolean,
  * clockCallBack: Function (Run after Clock stops),
 * }
 */
const Clock = ({
  isTest,
  disablePump,
  reasonToStop,
  clockCallback,
}) => {
  if (disablePump) console.log('pump deactiviated');

  let pumpSetting = disablePump;
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
  let amSucceeding = false;
  const determineIfSucceeding = (status) => {
    if (status) amSucceeding = status;
    return amSucceeding;
  };
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

    // Handle when time is changed into an earlier time -- skipping the alarm
    if (storedAlarm1 > theCurrentTime() && alarm1() < theCurrentTime()) {
      storedAlarm1 = alarm1();
      setDisarmTime1(null);
      setDisarmTime2(null);
      setAlarm1(alarm1());
      setAlarm2(alarm2());
      setSuccess(0);
      setUsername('daurham');
      setTimeout(() => postDisarmRecord(getSocket), 500);
      incrementDaysSkipped();
      dataWasRecordedToday = true;
    }

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
        // If Disamred during phase 1
        if (isDisarmed() === true) {
          // Store disarm time for Record Keeping
          storedDisarmTime1 = theCurrentTime();
          setDisarmTime1(storedDisarmTime1);
          // Keep track of success
          bypassAlarm(determineIfSucceeding, 1);
        }
      }
    }

    if (currentPhase === 2 && !skipToday) {
      // Initiate Phase 2
      if (theCurrentTime() === aFewSecIntoAlarm1() && isDisarmed()) toggleDisarmStatus();
      // Handle Alarm2 Failure:
      if (theCurrentTime() === alarm2() && !isDisarmed()) runAlarm(pumpSetting, 2);
      // If Disarm Status Changes
      if (storedIsDisarmed !== isDisarmed()) {
        storedIsDisarmed = isDisarmed();
        // If Disamred during phase 2
        if (isDisarmed() === true) {
          // Store disarm time for Record Keeping
          storedDisarmTime2 = theCurrentTime();
          setDisarmTime2(storedDisarmTime2);
          // Handle Streak++ & Reset
          bypassAlarm(determineIfSucceeding, 2);
        }
      }
    }

    if (currentPhase === 3) {
      if (theCurrentTime() === aFewSecIntoAlarm2()) {
        // reset disarm status
        if (isDisarmed()) toggleDisarmStatus();
        if (!dataWasRecordedToday) {
          // post data & reset daily logging
          postDisarmRecord(getSocket);
          dataWasRecordedToday = true;
        }
      }
    }

    if (isTest) checkTestLogs(testingTools);

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
