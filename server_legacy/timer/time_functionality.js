// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// const {fn} = require('./closure');
// const {fn.f2} ,= require('./closure');
// const {fn.f3} ,= require('./closure');
const { Temporal } = require('@js-temporal/polyfill');
const controller = require('../controller');
const convert = require('./convert');
const { on, off, runPump, mods, button, blinkFns, keepOff, keepOn } = require('../Gpio');
const activateYellowLED = () => on(mods.yellowLED);
const activateRedLED = () => on(mods.redLED);
// const activateGreenLED = () => on(mods.greenLED);
const deactivateYellowLED = () => off(mods.yellowLED);
const deactivateRedLED = () => off(mods.redLED);
// const deactivateGreenLED = () => off(mods.greenLED);
// let greenLED = false;
const { yellowLED } = mods;

let failsafe = false;
let alarmTime;
let currStreak;
let isDefused;

// TODO: 
// Finish backend / client shared Defuse fuctionality. // add table to db. Add request to client code, which will notify backend
// Finish backend / client shared Streak Failure fuctionality. // Is this set? hm..

// activateGreenLED()

// streak failure vars:
let failedStreak = false;

String.prototype.secUnit = function (start = -4) { return this.slice(start, -3) };
String.prototype.hr = function () { return this.slice(0, this.indexOf(':')) };
String.prototype.min = function () { return this.slice(this.indexOf(':') + 1, this.indexOf(':', 3)) };
String.prototype.tod = function () { return this.slice(-2, this.length) };
const toggleTOD = (time) => { let tod = time.tod(); time = time.slice(0, -2); return time + (tod === 'AM' ? 'PM' : 'AM') };


const currTime = () => Temporal.Now.plainTimeISO().toLocaleString();

const getCurrentTime = () => controller.getData({ table: 'alarmtime', cb: (time) => alarmTime = convert((new Temporal.PlainTime(((time[0].hour === 24 ? 0 : time[0].hour)), time[0].minute))) })
const getCurrentStreak = () => controller.getData({ table: 'streakcount', cb: (streak) => currStreak = streak[0].streak });
const getDefuseStatus = () => controller.getData({ table: 'defusal', cb: (status) => isDefused = (status[0].defusal === 0 ? false : true) });
const resetStreak = () => controller.updateStreak({ newStreak: 0, oldStreak: currStreak, cb: console.log });
const updateDefusal = () => controller.updateDefusal({ newVal: (isDefused ? 0 : 1), oldVal: (isDefused ? 1 : 0), cb: getDefuseStatus });
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
  runPump('test'); // test == Yellow LED, remove for pump running.
  initiateStreakFailure(); // runs on the red LED for 20hrs
  resetStreak();
};

const get20thHour = () => {
  let emitRedLEDUnitlThisTime = convert(new Temporal.PlainTime(((alarmTime.tod() === 'PM' ? Number(alarmTime.hr()) + 12 : Number(alarmTime.hr())) + 20) % 24, alarmTime.min()))
  if (alarmTime.hr() == 12) emitRedLEDUnitlThisTime = toggleTOD(emitRedLEDUnitlThisTime);
  return emitRedLEDUnitlThisTime;

}
//* TODO: Look into if I HAVE to to use a power source JUST for the button.
let isClicked = false;
button.watch((err, value) => {
  if (err) {
    console.log('There was an Error: ', err);

  } else {
    if (value === 1) isClicked = true;
    if (value === 0) isClicked = false;
    console.log('Click Event: ', currTime(), 'isClicked:', isClicked, value);
    
    if (value === 1) {
      
      // console.log('INSIDE Click Event: ', currTime(), 'isClicked:', isClicked);
      setTimeout(() => {
        if (value === 1 && isClicked) {
          // console.log('EMC Wrapped');
          updateDefusal();
        }
      })
    }

  }
});
process.on('SIGINT', () => { button.unexport(); yellowLED.unexport(); });  
//  */

const initialize = (alarmTime, currStreak, isDefused) => {
  if (!alarmTime) getCurrentTime();
  if (!currStreak) getCurrentStreak();
  if (isDefused === undefined) getDefuseStatus();
};


// activateRedLED(); 
const App = () => {
  initialize();
  // on(yellowLED);
  // defuseBlink();
  let intervalObj = setInterval(() => { // begin interval 
    // console.log('closure Test:', fn.f());
    // console.log('closure Test:', fn.f2() );
    // console.log('closure Test:', fn.f3() );
    if (isDefused) keepOn(); //on(mods.yellowLED);
    if (!isDefused) keepOff(); //off(mods.yellowLED);
    // if (currTime().secUnit() == 0) console.log('isDefused: ', isDefused);
    if (currTime().secUnit() == 0)console.log(`\ncurrTime:${currTime()}n\alarmTime: ${alarmTime}n\failedStreak: ${failedStreak} \nisDefused: ${isDefused} streak: ${currStreak}`);
    if (failedStreak && (currTime() === get20thHour())) resetStreakFailure()// Check to disble streakFailure
    if (currTime() === alarmTime && !isDefused) runAlarm(); // Handle alarm
    if (currTime() === alarmTime && isDefused) successfulStreak(); // Handle streak increment
    if (failsafe) { // check if somethings broke, disable interval
      clearInterval(intervalObj);
      // deactivateGreenLED();
    }
  }, 1000);
};

module.exports = { App, getCurrentStreak, getCurrentTime, getDefuseStatus };