/* 
const { mods } = require('./mods');
const helpers = require('./helpers')(mods);

module.exports = { helpers };

 */

//* 
const { Gpio } = require('onoff');
let state = false;

const relay = new Gpio(25, 'out');
// const greenLED = new Gpio(24, 'out'); // 3.3Vs, 2.1Vf, 20mA(If) == 60r| = using 47r
// const redLED = new Gpio(23, 'out'); // 3.3Vs, 2Vf, 20mA(If) == 65r| = using 47r
const yellowLED = new Gpio(22, 'out'); // 3.3Vs, 2.1Vf, 20mA(If) == 60| = using 47r
// const blueLED = new Gpio(4, 'out'); // 5Vs, 3.6Vf, 30mA(If) == 47r| = using 47r/cant3.3
// const whiteLED = new Gpio(27, 'out'); // 5Vs, 3.6Vf, 30mA(If) == 47r| = using 47r/cant3.3
const button = new Gpio(23, 'in', 'both'); // 
const mods = { relay, yellowLED };
// const mods = { relay, greenLED, redLED, blueLED, whiteLED, yellowLED };
// TODO: Create code for a defuse button & export

let interval;
let activeG = false;
let activeR = false;
let activeY = false;

const blinkG = () => (activeG ? deactivate(greenLED, activeG) : activate(greenLED, activeG));
const blinkR = () => (activeR ? deactivate(redLED, activeR) : activate(redLED, activeR));
const blinkY = () => (activeY ? deactivate(yellowLED, activeY) : activate(yellowLED, activeY));
const blinkTogG = null; // = (turnOn) => (turnOn ? deactivate(greenLED, activeG) : activate(greenLED, activeG));
const blinkTogR = null; // = (turnOn) => (turnOn ? deactivate(redLED, activeR) : activate(redLED, activeR));
const blinkTogY = null; // = (turnOn) => (turnOn ? deactivate(yellowLED, activeY) : activate(yellowLED, activeY));
const dance = (fns, loop) => { let i = 0; while(i < loop) {fns.forEach(f => console.log(f) ); i++} };

const blinkFns = { blinkG, blinkR, blinkY, blinkTogG, blinkTogR, blinkTogY, dance }; 

const deactivate = (LED, active) => { LED.writeSync(0); active = false; console.log('deactivate:', active) };
const activate = (LED, active) => { LED.writeSync(1); active = true; console.log('activate:', active) };

const flash = (blinkLED, speed) => { if (!interval) { interval = setInterval(blinkLED, speed) } };
const stopFlash = (LED) => { clearInterval(interval); deactivate(LED) };

const runLED = (LED, blinkLED, durationMs = 420000, speedMs = 500) => { flash(blinkLED, speedMs); setTimeout(() => { stopFlash(LED) }, durationMs); };

const off = (mod) => { mod.writeSync(0); state = false; };

const on = (mod) => { mod.writeSync(1); state = true; };



const runPump = (test) => {
  let pump = (test ? redLED : relay);
    on(pump);
    console.log((state ? 'off' : 'on'));
    setTimeout(() => off(pump), 7000);
    console.log((state ? 'off' : 'on'));
    // state = !state;
};

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}
// const defuseBlink = async (ms = 500) => {
  // for (let i = 0; i < 4; i++) { 
    // await sleep(ms);
    // console.log('1')
    // blinkG();    
    // await sleep(ms);
    // console.log('2')
    // blinkG();
    // await sleep(ms);
    // console.log('3') 
    // blinkG();  
    // await sleep(ms);
    // console.log('4')
    // blinkG();    
    // await sleep(ms); 
    // console.log('5')
    // blinkG();
    // await sleep(ms);
    // console.log('6')
    // blinkG(); 
  // }
// };
// defuseBlink(); 
// const asyncFoo = async () => {
//     await sleep(2000);
//     console.log('look at this');
//     await sleep(1000);
//     console.log('getting fancy now');
// }
let keepOn = () => activeY ? null : on(yellowLED);
let keepOff = () => activeY ? null : off(yellowLED);

module.exports = { on, off, runLED, flash, stopFlash, mods, blinkFns, runPump, button, keepOff, keepOn };
// */


/* 

// import mods
// import helpers
// load helpers with mods
// all closured off

*/