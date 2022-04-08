const Gpio = require('onoff').Gpio;
let state = false;

const relay = new Gpio(25, 'out');
const greenLED = new Gpio(24, 'out'); // 3.3Vs, 2.1Vf, 20mA(If) == 60r| = using 47r
const redLED = new Gpio(23, 'out'); // 3.3Vs, 2Vf, 20mA(If) == 65r| = using 47r
const blueLED = new Gpio(22, 'out'); // 5Vs, 3.6Vf, 30mA(If) == 47r| = using 47r/cant3.3
const whiteLED = new Gpio(27, 'out'); // 5Vs, 3.6Vf, 30mA(If) == 47r| = using 47r/cant3.3
const yellowLED = new Gpio(4, 'out'); // 3.3Vs, 2.1Vf, 20mA(If) == 60| = using 47r
const modules = { relay, greenLED, redLED, blueLED, whiteLED, yellowLED };

let interval;
let active = false;

const deactivate = (LED) => { LED.writeSync(0); active = false };
const activate = (LED) => { LED.writeSync(1); active = true };

const blinkG = () => (active ? deactivate() : activate());
const flash = () => { if (!interval) { interval = setInterval(blinkG, 150) } };
const stopFlash = () => { clearInterval(interval); deactivate() };

const runLED = () => { flash(); setTimeout(() => { stopFlash() }, 7000); };

const off = (mod) => { mod.writeSync(0); state = false; };

const on = (mod) => { mod.writeSync(1); state = true; };

module.exports = { on, off, runLED, flash, stopFlash, modules };