/**
 * Utils contains a list of various utility functions.
 */

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
const today = new Date();

const getFirstAlarm = (hour, minute) => new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate(),
  hour,
  minute,
  0,
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

module.exports = {
  swapBinaryAndBool,
  theCurrentTime,
  addMinutes,
  addSeconds,
  getFirstAlarm,
  getSecondAlarm,
  parseTimeData,
};
