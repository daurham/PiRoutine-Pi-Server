const { Temporal } = require('@js-temporal/polyfill');
const controller = require('../controller');
const convert = require('./convert');
const { on, off, runPump, mods } = require('../gpios');
const activateYellowLED = () => on(mods.yellowLED);
const activateRedLED = () => on(mods.redLED);
const activateGreenLED = () => on(mods.greenLED);
const deactivateYellowLED = () => off(mods.yellowLED);
const deactivateRedLED = () => off(mods.redLED);
const deactivateGreenLED = () => off(mods.greenLED);

let failsafe = false;
let alarmTime;
let currStreak;
let isDefused;

// TODO: 
// Finish backend / client shared Defuse fuctionality. // add table to db. Add request to client code, which will notify backend
// Finish backend / client shared Streak Failure fuctionality. // Is this set? hm..



// streak failure vars:
let failedStreak = false;

String.prototype.secUnit = function (start = -4) { return this.slice(start, -3) };
String.prototype.hr = function () { return this.slice(0, this.indexOf(':')) };
String.prototype.min = function () { return this.slice(this.indexOf(':') + 1, this.indexOf(':', 3)) };
String.prototype.tod = function () { return this.slice(-2, this.length) };
const toggleTOD = (time) => { let tod = time.tod(); time = time.slice(0, -2); return time + (tod === 'AM' ? 'PM' : 'AM') };


const currTime = () => Temporal.Now.plainTimeISO().toLocaleString();

const getCurrentTime = () => controller.getData({ table: 'alarmtime', cb: (time) => alarmTime = convert((new Temporal.PlainTime(((time[0].hour === 24 ? 0 : time[0].hour)), time[0].minute))) })
const getCurrentStreak = () => controller.getData({ table: 'streak', cb: (streak) => currStreak = streak[0].streak });
const getDefuseStatus = () => controller.getData({ table: 'defusal', cb: (status) => isDefused = (status[0].defusal === 0 ? false : true) });
const resetStreak = () => controller.updateStreak({ newStreak: 0, oldStreak: currStreak, cb: console.log });
const updateDefusal = () => controller.updateDefusal({ newVal: (isDefused ? 0 : 1), oldVal: (isDefused ? 1 : 0), cb: (status) => isDefused = (status[0].defusal === 0 ? false : true) });
const incrementStreak = () => controller.updateStreak({ newStreak: currStreak + 1, oldStreak: currStreak, cb: console.log });
const initiateStreakFailure = () => activateRedLED(); // turn on red LED

const resetStreakFailure = () => {
  failedStreak = false;
  deactivateRedLED(); // turn off red LED
  console.log('Red Punishment Over!')
};
const successfulStreak = () => {
  updateDefusal();
  incrementStreak();
};
const runAlarm = () => {
  failedStreak = true;
  runPump('test'); // test == Yellow LED
  initiateStreakFailure(); // runs on the red LED for 20hrs
  resetStreak();
};

const get20thHour = () => {
  let emitRedLEDUnitlThisTime = convert(new Temporal.PlainTime(((alarmTime.tod() === 'PM' ? Number(alarmTime.hr()) + 12 : Number(alarmTime.hr())) + 20) % 24, alarmTime.min()))
  if (alarmTime.hr() == 12) emitRedLEDUnitlThisTime = toggleTOD(emitRedLEDUnitlThisTime);
  return emitRedLEDUnitlThisTime;
}

const App = () => {
  if (!alarmTime) getCurrentTime();
  if (!currStreak) getCurrentStreak();
  if (isDefused === undefined) getDefuseStatus();
  activateGreenLED();
  let intervalObj = setInterval(() => { // begin interval 
    console.log('currTime: ', currTime(), 'alarmTime: ', alarmTime, 'failedStreak: ', failedStreak, 'isDefused: ', isDefused, 'streak: ', currStreak);
    if (failedStreak && (currTime() === get20thHour())) resetStreakFailure()// Check to disble streakFailure
    if (currTime() === alarmTime && !isDefused) runAlarm(); // Handle alarm
    if (currTime() === alarmTime && isDefused) successfulStreak(); // Handle streak increment
    if (failsafe) { // check if somethings broke, disable interval
      clearInterval(intervalObj);
      deactivateGreenLED();
    }
  }, 1000);
};

module.exports = { App, getCurrentStreak, getCurrentTime, getDefuseStatus };