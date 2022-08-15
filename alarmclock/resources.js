/**
 * This file is responsidble for keeping the current
 *  alarmTime, isDisarmed & streakCount values up to date.
 *  */
const io = require('socket.io-client');
const env = require('dotenv').config().parsed;
const { toggleDisarm, onClick } = require('./gpio').helpers;
const { getTime } = require('./utils');

const { PORT } = env;
const socket = io.connect(`http://127.0.0.1:${PORT}`, { reconnect: true });

// const { yellowLED } = require('./gpio/modules');
// IMPORT CURRENT TIME INTERVAL

let alarmTime;
let isDisarmed;
let streakCount;

// GPIO button & event handler
const handleDisarmClick = () => socket.emit('update-disarm-status', !isDisarmed);
onClick(handleDisarmClick);

// Add a connect listener
socket.on('connect', () => {
  console.log('Connected!', getTime());
});

// Socket GET
if (
  alarmTime === undefined
  || isDisarmed === undefined
  || streakCount === undefined
) {
  socket.emit('get-alarm-time');
  socket.emit('get-disarm-status');
  socket.emit('get-streak-count');
}

socket.on('got-alarm-time', (time) => {
  alarmTime = time;
  console.log('alarmTime obtained:', alarmTime);
});
socket.on('got-disarm-status', (status) => {
  isDisarmed = status[0].disarmedstatus;
  console.log('disarm status obtained:', isDisarmed);
});
socket.on('got-streak-count', (count) => {
  streakCount = count[0].streak;
  console.log('streak obtained:', streakCount);
});

// Socket UPDATE
socket.on('updated-alarm-time', (time) => {
  console.log('alarm data obtained:', time);
  alarmTime = time;
  console.log('updated alarm obtained:', alarmTime);
});
socket.on('updated-disarm-status', (status) => {
  console.log('disarm status data obtained:', status);
  isDisarmed = (status === 'true' || status === true || status === 1 || status === '1');
  console.log('updated disarm status obtained:', isDisarmed);
  toggleDisarm(true, handleDisarmClick);
});
socket.on('updated-streak-count', (count) => {
  console.log('streak data obtained:', streakCount);
  streakCount = count;
  console.log('updated streak obtained:', streakCount);
});

module.exports = {
  getSocket: () => socket,
  getAlarmTimeData: () => alarmTime,
  getDisarmStatus: () => isDisarmed,
  getStreakCount: () => streakCount,
};
