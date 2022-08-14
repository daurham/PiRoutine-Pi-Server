const io = require('socket.io-client');
const env = require('dotenv').config().parsed;
const { toggleMod, onClick } = require('./gpio').helpers;
const { yellowLED } = require('./gpio/modules');

const { PORT } = env;
const socket = io.connect(`http://127.0.0.1:${PORT}`, { reconnect: true });

const getTime = () => new Date().toLocaleTimeString();
let alarmTime;
let isDisarmed;
let streak;

const toggleDifusal = (click) => {
  toggleMod(yellowLED);
  if (click) socket.emit('update-defuse', !isDisarmed);
};

// Add a connect listener
socket.on('connect', () => {
  console.log('Connected!', getTime());
});

// Socket GET
socket.emit('get-alarm-time');
socket.on('got-alarm-time', (value) => {
  alarmTime = value;
  console.log('alarmTime obtained:', alarmTime);
});
socket.emit('get-defuse');
socket.on('got-defuse-value', (value) => {
  isDisarmed = value;
  console.log('defusal obtained:', isDisarmed);
});
socket.emit('get-streak');
socket.on('got-streak-value', (value) => {
  streak = value;
  console.log('streak obtained:', streak);
});

// Socket UPDATE
socket.on('updated-alarm-time', (value) => {
  isDisarmed = (value === 'true');
  console.log('updated alarm obtained:', isDisarmed);
});
socket.on('updated-defuse-value', (value) => {
  isDisarmed = (value === 'true');
  console.log('updated defusal obtained:', isDisarmed);
  toggleDifusal();
});
socket.on('updated-streak-value', (value) => {
  streak = value;
  console.log('updated streak obtained:', streak);
});

// GPIO button & event handler
const handleClick = () => socket.emit('update-defuse');
onClick(handleClick);
