/**
 * This test will ensure I can autommatically post my alarm data daily.
 *
 * Run:
 *      node tests/Clock.postDisarmRecords.test.js
 *
 * This test will demonstrate:
 * - The ability to POST alarm data in the db on a daily basis.
 *
 * As of now, these tests are observation-based.
 * Check db after test ends to ensure data was stored.
 */

// Client Imports:
const {
  theCurrentTime,
  makeTime,
  addSeconds,
  addMinutes,
} = require('../alarmclock/utils');
const {
  Clock,
  socket,
} = require('../alarmclock/Clock');
const { button, yellowLED } = require('../alarmclock/gpio/modules');

const purpose = 'Records of alarm data is posted to database';

// DUMMY DATA:
// Set alarmOne to be 1 min from now
const alarmOneTStamp = makeTime(new Date().getHours(), new Date().getMinutes() + 1);
const alarmOne = alarmOneTStamp.toLocaleTimeString();
// Set alarmTwo to be 30 sec after alarmOne
const alarmTwoTStamp = addSeconds(alarmOneTStamp, 30);
const alarmTwo = alarmTwoTStamp.toLocaleTimeString();
// 3 sec after alarm1
const fewSecIntoAlarmOne = addSeconds(alarmOneTStamp, 3).toLocaleTimeString();
// 3 sec after alarm2
const fewSecIntoAlarmTwo = addSeconds(alarmTwoTStamp, 3).toLocaleTimeString();
// Break out 1min after alarm 1
const breakOutTime = addMinutes(alarmOneTStamp, 1).toLocaleTimeString();

console.log(`I'm testing ${purpose}, My values are:
  alarm1: ${alarmOne}
  fewSecAlarm1: ${fewSecIntoAlarmOne}
  alarm2: ${alarmTwo}
  fewSecAlarm2: ${fewSecIntoAlarmTwo}
`);

const callback = () => {
  socket().close();
  console.log('End Of Test.');
  // Close GPIO listeners
  button.unexport();
  yellowLED.unexport();
};

/* ///////////////////////////////////////////////////////////////////// */

// Init AlarmClock w/ Test Options
Clock({
  isTest: {
    alarmOne,
    alarmTwo,
    fewSecIntoAlarmOne,
    fewSecIntoAlarmTwo,
  },
  reasonToStop: () => {
    console.log('curTime:', theCurrentTime(), 'breakout @:', breakOutTime);
    socket().emit('ended', 'test');

    return (theCurrentTime() === breakOutTime);
  },
  clockCallback: () => callback(),
});

// Watch pm2 log 0 & wait for successful console.log || check DB after test ends.
