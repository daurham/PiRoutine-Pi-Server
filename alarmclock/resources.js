/**
 * This file is responsidble for keeping the current
 *  alarmTime, isDisarmed & streakCount values up to date.
 */

const io = require('socket.io-client');
const env = require('dotenv').config().parsed;
const { onClick } = require('./gpio');
const {
  theCurrentTime,
  parseTimeData,
  makeTime,
  getSecondAlarm,
  addSeconds,
  swapBinaryAndBool,
} = require('./utils');

const { PORT } = env;
const socket = io.connect(`http://127.0.0.1:${PORT}`, { reconnect: true });

// Resources
let alarmTime1;
let alarmTime2;
let aFewSecIntoAlarm1;
let aFewSecIntoAlarm2;
let isDisarmed;
let streakCount;
let skippedCount;
let soakedCount;
let skipDate;

// GPIO button & event handler
const handleDisarmClick = () => socket.emit('update-disarm-status', !isDisarmed);
onClick(handleDisarmClick); // Toggle Disarm Status

// Add a connect listener
socket.on('connect', () => {
  console.log('Connected!', theCurrentTime());
});

// Socket GET
if (
  alarmTime1 === undefined
  || isDisarmed === undefined
  || streakCount === undefined
) {
  socket.emit('get-alarm-time');
  socket.emit('get-disarm-status');
  socket.emit('get-streak-count');
  socket.emit('get-skipped-data');
  socket.emit('get-soaked-count');
}

socket.on('got-alarm-time', (time) => {
  const { hour, minute } = parseTimeData(time);
  alarmTime1 = makeTime(hour, minute).toLocaleTimeString();
  alarmTime2 = getSecondAlarm(makeTime(hour, minute), 7).toLocaleTimeString();
  aFewSecIntoAlarm1 = addSeconds(makeTime(hour, minute), 3).toLocaleTimeString();
  aFewSecIntoAlarm2 = addSeconds(getSecondAlarm(makeTime(hour, minute), 7), 3).toLocaleTimeString();
  console.log('alarmTime1 set to:', alarmTime1);
  console.log('alarmTime2 set to:', alarmTime2);
  console.log('afew1 set to:', aFewSecIntoAlarm1);
  console.log('afew2 set to:', aFewSecIntoAlarm2);
});
socket.on('got-disarm-status', (status) => { // [ { id: 1, disarmedstatus: 1 } ]
  isDisarmed = swapBinaryAndBool(status[0].disarmedstatus); // turns to Boolean
  console.log('disarm status set to:', isDisarmed);
});
socket.on('got-streak-count', (count) => {
  streakCount = count[0].streak;
  console.log('streak set to:', streakCount);
});
socket.on('got-skipped-data', (data) => {
  skippedCount = data[0].skipped;
  skipDate = data[0].skipdate;
  console.log('skipped set to:', skippedCount);
  console.log('skipDate set to:', skipDate);
});
socket.on('got-soaked-count', (count) => {
  soakedCount = count[0].soaked;
  console.log('soaked set to:', soakedCount);
});

// Socket UPDATE
socket.on('updated-alarm-time', () => {
  socket.emit('get-alarm-time');
  console.log('updated alarm, from:', alarmTime1);
});
socket.on('updated-disarm-status', () => {
  socket.emit('get-disarm-status');
  console.log('updated disarm status, from:', isDisarmed);
});
socket.on('updated-streak-count', () => {
  socket.emit('get-streak-count');
  console.log('updated streak, from:', streakCount);
});
socket.on('updated-skipped-count', () => {
  socket.emit('get-skipped-data');
  console.log('updated skipped, from:', skippedCount);
});
socket.on('updated-skipped-date', () => {
  socket.emit('get-skipped-data');
  console.log('updated skipDate, from:', skipDate);
});
socket.on('updated-soaked-count', () => {
  socket.emit('get-soaked-count');
  console.log('updated soaked, from:', soakedCount);
});

// Exporting Current Values
module.exports = {
  getSocket: () => socket,
  getDisarmStatus: () => isDisarmed,
  getStreakCount: () => streakCount,
  getAlarmData: () => ({
    alarmTime1,
    alarmTime2,
    aFewSecIntoAlarm1,
    aFewSecIntoAlarm2,
    skippedCount,
    soakedCount,
    skipDate,
  }),
};
