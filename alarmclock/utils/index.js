/**
 * /utils contains a list of various utility functions.
 *
 */

const EVENTS = require('./socketEvents');
const { checkTestLogs } = require('./ClockTestLogs');

const parseTimeData = (timeObj) => {
  const { hour, minute } = timeObj[0];
  return { hour, minute };
};

const theCurrentTime = () => new Date().toLocaleTimeString();

const addMinutes = (dTimeStamp, minutes) => new Date(
  dTimeStamp.getTime() + Number(minutes) * 60000,
);
const addSeconds = (dTimeStamp, seconds) => new Date(
  dTimeStamp.getTime() + Number(seconds) * 1000,
);

// Adds 7 min to initial alarm
// const getSecondAlarm = (alarm1TimeStamp, minDelay = 7) => addMinutes(alarm1TimeStamp, minDelay);
const getSecondAlarm = (alarm1TimeStamp, minDelay = 7) => addMinutes(alarm1TimeStamp, minDelay);

const swapBinaryAndBool = (val) => {
  if (val === true) return 1;
  if (val === false) return 0;
  if (val === 'true') return 1;
  if (val === 'false') return 0;
  if (val === 1) return true;
  if (val === 0) return false;
  if (val === '1') return true;
  if (val === '0') return false;
  return undefined;
};

const makeTime = (hour, minute) => new Date(
  new Date().getFullYear(),
  new Date().getMonth(),
  new Date().getDate(),
  hour,
  minute,
  0,
);

const getHour = (time) => time.slice(0, time.indexOf(':'));
const getMinute = (time) => time.slice(time.indexOf(':') + 1, time.lastIndexOf(':'));

const getPhase = (startTime, endTime, currentTime) => {
  // get TOD
  const startTOD = startTime.slice(-2);
  const endTOD = endTime.slice(-2);
  const currentTOD = currentTime.slice(-2);
  // get Hr
  const startHour = getHour(startTime);
  const endHour = getHour(endTime);
  const currentHour = getHour(currentTime);
  // get total Hrs
  let startTotalHours = startHour;
  startTotalHours += (startTOD === 'AM' || (startTOD === 'AM' && Number(startHour)) === 12 ? 0 : 12);
  let endTotalHours = endHour;
  endTotalHours += (endTOD === 'AM' || (endTOD === 'AM' && Number(endHour)) === 12 ? 0 : 12);
  let currentTotalHours = currentHour;
  currentTotalHours += (currentTOD === 'AM' || (currentTOD === 'AM' && Number(currentHour)) === 12 ? 0 : 12);

  // Handle polar ranges
  if (currentTotalHours < startTotalHours) return 1;
  if (currentTotalHours > endTotalHours) return 3;

  // Hanlde shared TOD ranges
  if (
    currentTotalHours === startTotalHours
    || currentTotalHours === endTotalHours
  ) {
    //  Phase 1
    if (currentTime <= startTime && startTOD === currentTOD) return 1;
    //  Phase 2
    if (currentTime > startTime && currentTime <= endTime) return 2;
    //  Phase 3
    if (currentTime > endTime) return 3;
  }
  return `getPhase ERROR: @${currentTime}, with Alarms: ${startTime} & ${endTime}`;
};

module.exports = {
  swapBinaryAndBool,
  theCurrentTime,
  addMinutes,
  addSeconds,
  makeTime,
  getSecondAlarm,
  parseTimeData,
  getPhase,
  getHour,
  getMinute,
  checkTestLogs,
  EVENTS,
};
