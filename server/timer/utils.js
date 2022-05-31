const { Temporal } = require('@js-temporal/polyfill');
const controller = require('../controller');
const convert = require('./convert');
// const gpio = require('../gpios');
// const activateYellowLED = gpio.on(gpio.mods.yellowLED);
// const activateRedLED = gpio.on(gpio.mods.redLED);
// const activateGreenLED = gpio.on(gpio.mods.greenLED);ED);
// const deactivateYellowLED = gpio.on(gpio.mods.yellowLED);
// const deactivateRedLED = gpio.on(gpio.mods.redLED);
// const deactivateGreenLED = gpio.on(gpio.mods.greenLED);
// let isDefused = false;
let failsafe = false;
let alarmTime;
let currStreak;
let isDefused;

// TODO: 
  // Finish backend / client shared Defuse fuctionality.
  // Finish backend / client shared Streak Failure fuctionality.
  // Finish backend 20hr red LED fuctionality. => The String.protos are ready for simple work of it.
  /* 
  IF it fails, use a function to calculate the alarmTime + 20 hours.
  */
  // Finsih 


// streak failure vars:
let failedStreak = false;

String.prototype.secUnit = function (start = -4) { return this.slice(start, -3) };
String.prototype.hr = function () { return this.slice(0, this.indexOf(':')) };
String.prototype.min = function () { return this.slice(this.indexOf(':') + 1, this.indexOf(':', 3)) };
String.prototype.tod = function () { return this.slice(-2, this.length) };
const toggleTOD = (time) => { let tod = time.tod(); time = time.slice(0, -2); return time + (tod === 'AM' ? 'PM' : 'AM') };


const currTime = () => Temporal.Now.plainTimeISO().toLocaleString();
// let currTime = currTime();

// const getAlarmTime = (userInput) => alarmTime = userInput;

// const defuseAlarm = () => { isDefused = true };
// const defuseAlarm = () => { isDefused = true };
// const toggleAlarm = () => { isDefused = (!isDefused ? true : false) };


const getCurrentTime = () => controller.getData({table: 'alarmtime', cb: (time) => alarmTime = convert((new Temporal.PlainTime(((time[0].hour === 24 ? 0 : time[0].hour)), time[0].minute)))})
const getCurrentStreak = () => controller.getData({table: 'streak', cb: (streak) => currStreak = streak[0].streak});
const getDefuseStatus = () => controller.getData({table: 'defusal', cb: (status) => isDefused = (status[0].defusal === 0 ? false : true)});
const resetStreak = () => controller.updateStreak({newStreak: 0, oldStreak: currStreak, cb: console.log });
const updateDefusal = () => controller.updateDefusal({newVal: (isDefused ? 0:1), oldVal: (isDefused ? 1:0), cb: (status) => isDefused = (status[0].defusal === 0 ? false : true)});
const incrementStreak = () => controller.updateStreak({newStreak: currStreak + 1, oldStreak: currStreak, cb: console.log });
// const initiateStreakFailure = () => activateRedLED(); // turn on red LED

const resetStreakFailure = () => {
  failedStreak = false;
  // deactivateRedLED(); turn off red LED
  console.log('streak lost!')
};
const successfulStreak = () => {
  updateDefusal();
  incrementStreak();
};
const runAlarm = () => {
  failedStreak = true;
  // gpio.runPump('test'); // test == Yellow LED
  // initiateStreakFailure(); // runs on the red LED for 20hrs
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
  let intervalObj = setInterval(() => { // begin interval 
    // currTime = currTime();
    // if (!alarmTime) getAlarmTime();
    // console.log('currTime: ', currTime());
    console.log('currTime: ', currTime(), 'alarmTime: ', alarmTime);
    // console.log('alarmTime: ', alarmTime);
    // console.log('isDefused: ', alarmTime.indexOf(':'));
    console.log('failedStreak: ', failedStreak);
    console.log('isDefused: ', isDefused);
    // console.log('isDefused: ', isDefused);
    // console.log('hrs: ', alarmTime.hr()); 
    // console.log('Current Streak: ', currStreak);
    // console.log((alarmTime.tod()) )
    // console.log((alarmTime.tod() === 'PM' ? Number(alarmTime.hr()) + 12 : alarmTime.hr()) + 20)
    console.log('plus 20hr: ', get20thHour());
    // console.log(get20thHour())
    // console.log('seconds: ', currTime().slice(-5, -3));
    if (failedStreak && (currTime() === get20thHour())) resetStreakFailure()// Check to disble streakFailure
    // if ((currTime().secUnit() === '0' || currTime().secUnit() === '5') && !isDefused) console.log(alarmTime, currStreak, isDefused, currTime(),);
    if (currTime() === alarmTime && !isDefused) runAlarm();
    if (currTime() === alarmTime && isDefused) successfulStreak(); 
    if (failsafe) { // check if somethings broke, disable interval
      clearInterval(intervalObj);
    }
  }, 1000);
};

module.exports = { App, getCurrentStreak, getCurrentTime, getDefuseStatus };