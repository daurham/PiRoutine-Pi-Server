/**
 * Utils contains a list of various utility functions.
 */

const parseTimeData = (timeObj) => {
  const { hour, minute } = timeObj[0];
  return { hour, minute };
};

const theCurrentTime = () => new Date().toLocaleTimeString();
const addMinutes = (date, minutes) => new Date(date.getTime() + minutes * 60000);
const addSeconds = (date, seconds) => new Date(date.getTime() + seconds * 1000);
const today = new Date();

const getFirstAlarm = (hour, minute) => new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate(),
  hour,
  minute,
  0,
);

const getSecondAlarm = (alarm1) => addMinutes(alarm1, 7); // Adds 7 min to initial alarm

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
