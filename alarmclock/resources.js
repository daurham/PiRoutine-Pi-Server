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
  getFirstAlarm,
  getSecondAlarm,
  addSeconds,
  swapBinaryAndBool,
} = require('./utils');

const { PORT } = env;
const socket = io.connect(`http://127.0.0.1:${PORT}`, { reconnect: true });

// Resources
let alarmTime1;
let alarmTime2;
let tenSecIntoAlarm1;
let isDisarmed;
let streakCount;

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
}

socket.on('got-alarm-time', (time) => {
  const { hour, minute } = parseTimeData(time);
  alarmTime1 = getFirstAlarm(hour, minute).toLocaleTimeString();
  alarmTime2 = getSecondAlarm(getFirstAlarm(hour, minute)).toLocaleTimeString();
  tenSecIntoAlarm1 = addSeconds(getFirstAlarm(hour, minute), 10).toLocaleTimeString();
  console.log('alarmTime obtained:', alarmTime1);
});
socket.on('got-disarm-status', (status) => {
  console.log('disarm status obtained:', status);
  isDisarmed = swapBinaryAndBool(status[0].disarmedstatus); // turns too Boolean
  console.log('disarm status obtained:', isDisarmed);
});
socket.on('got-streak-count', (count) => {
  streakCount = count[0].streak;
  console.log('streak obtained:', streakCount);
});

// Socket UPDATE
socket.on('updated-alarm-time', () => {
  socket.emit('get-alarm-time');
  console.log('updated alarm obtained:', alarmTime1);
});
socket.on('updated-disarm-status', () => {
  socket.emit('get-disarm-status');
  console.log('updated disarm status obtained:', isDisarmed);
});
socket.on('updated-streak-count', () => {
  socket.emit('get-streak-count');
  console.log('updated streak obtained:', streakCount);
});

// Exporting Current Values
module.exports = {
  getSocket: () => socket,
  getDisarmStatus: () => isDisarmed,
  getStreakCount: () => streakCount,
  getAlarmData: () => ({
    alarmTime1,
    alarmTime2,
    tenSecIntoAlarm1,
  }),
};
