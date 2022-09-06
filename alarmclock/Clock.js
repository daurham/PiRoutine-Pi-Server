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
const alarm1 = () => getAlarmData().alarmTime1;
const alarm2 = () => getAlarmData().alarmTime2;
const aFewSecIntoAlarm1 = () => getAlarmData().aFewSecIntoAlarm1;
const aFewSecIntoAlarm2 = () => getAlarmData().aFewSecIntoAlarm2;

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
  setSuccess(1);
  toggleDisarmStatus();
  incrementStreak();
  setTimeout(() => console.log('after..?', isDisarmed()), 1000);
};
const runAlarm = (test) => {
  resetStreak();
  runPump(test); // test == Yellow LED, remove arg to enable pump.
  setSuccess(0);
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

/**
 * Store Common Values in this closure so I can keep track of when
 *  major changes occur. Such as when an Alarm time is changed or Skipped.
 */
const storeChanges = () => {
  let storedIsDisarmed;
  let storedDisarmTime1;
  let storedDisarmTime2;
  let storedStreak;
  let storedAlarm1;
  let storedAlarm2;
  let storedPhase;
  let dataWasRecordedToday = false;
  // let storedSkipCount; // SET UP
  // let storedSoakCount; // SET UP
  return (noPump) => {
    if (storedIsDisarmed === undefined) storedIsDisarmed = isDisarmed();
    if (storedStreak === undefined) storedStreak = streakCount();
    if (storedAlarm1 === undefined) storedAlarm1 = alarm1();
    if (storedAlarm2 === undefined) storedAlarm2 = alarm2();
    if (storedPhase === undefined) storedPhase = currentPhase;
    // if (storedSkipCount === undefined) storedSkipCount = getSkipCount(); // DOESNT EXIST
    // if (storedSoakCount === undefined) storedSoakCount = getSoakCount(); // DOESNT EXIST

    // IF Record Keeping Alarms Arent Defined:
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

    if (currentPhase === 1) {
      // Handle Alarm1 Failure:
      if (theCurrentTime() === alarm1() && !isDisarmed()) runAlarm(noPump);
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
        setDisarmTime1('N/A');
        setDisarmTime2('N/A');
        setAlarm1(alarm1());
        setAlarm2(alarm2());
        setSuccess(0);
        setUsername('daurham');
        setTimeout(() => postDisarmRecord(getSocket), 500);
        // Post record data & count this as a skip // SET UP
      }
    }

    if (currentPhase === 2) {
      // Initiate Phase 2
      if (theCurrentTime() === aFewSecIntoAlarm1() && isDisarmed()) toggleDisarmStatus();
      // Handle Alarm2 Failure:
      if (theCurrentTime() === alarm2() && !isDisarmed()) runAlarm(noPump);
      // Handle Streak++ & Reset
      if (theCurrentTime() === alarm2() && isDisarmed()) successfulStreak();
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
      if (theCurrentTime() === aFewSecIntoAlarm2) {
        if (!dataWasRecordedToday) postDisarmRecord(getSocket);
      }
    }
  };
};

const checkMainFunctionality = storeChanges();

/**
 *
 * @param {ClockOptions} param0
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
  // Initiate Clock
  const intervalObj = setInterval(() => {
    // Check for any reason to stop Clock
    if (!stoppingClock) {
      if (reasonToStop) stoppingClock = reasonToStop();
    }

    // Get CurrentPhase
    currentPhase = getPhase(alarm1(), alarm2(), theCurrentTime());
    // Makes sure LED activity represents DisarmStatus
    watchLED(isDisarmed());

    // Safely Test
    if (isTest) {
      const { alarmOne, alarmTwo, fewSecIntoAlarmOne } = isTest;
      checkTestFunctionality(!!isTest, alarmOne, alarmTwo, fewSecIntoAlarmOne);
    } else {
      // Watch For Changes And Handle Main Functionality
      checkMainFunctionality(noPump);
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
