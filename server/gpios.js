const Gpio = require('onoff').Gpio;
let state = false;

const relay = new Gpio(25, 'out');
const greenLED = new Gpio(24, 'out'); // 3.3Vs, 2.1Vf, 20mA(If) == 60r| = using 47r
const redLED = new Gpio(23, 'out'); // 3.3Vs, 2Vf, 20mA(If) == 65r| = using 47r
const yellowLED = new Gpio(22, 'out'); // 3.3Vs, 2.1Vf, 20mA(If) == 60| = using 47r
const blueLED = new Gpio(4, 'out'); // 5Vs, 3.6Vf, 30mA(If) == 47r| = using 47r/cant3.3
const whiteLED = new Gpio(27, 'out'); // 5Vs, 3.6Vf, 30mA(If) == 47r| = using 47r/cant3.3
const mods = { relay, greenLED, redLED, blueLED, whiteLED, yellowLED };

// TODO: Create code for a defuse button & export

let interval;
let active = false;

const blinkG = () => (active ? deactivate(greenLED) : activate(greenLED));
const blinkR = () => (active ? deactivate(redLED) : activate(redLED));
const blinkY = () => (active ? deactivate(yellowLED) : activate(yellowLED));
const dance = (fns, loop) => { let i = 0; while(i < loop) {fns.forEach(f => console.log(f) ); i++} };

const blinkFns = { blinkG, blinkR, blinkY, dance };

const deactivate = (LED) => { LED.writeSync(0); active = false };
const activate = (LED) => { LED.writeSync(1); active = true };

const flash = (blinkLED, speed) => { if (!interval) { interval = setInterval(blinkLED, speed) } };
const stopFlash = (LED) => { clearInterval(interval); deactivate(LED) };

const runLED = (LED, blinkLED, durationMs = 420000, speedMs = 500) => { flash(blinkLED, speedMs); setTimeout(() => { stopFlash(LED) }, durationMs); };

const off = (mod) => { mod.writeSync(0); state = false; };

const on = (mod) => { mod.writeSync(1); state = true; };

const runPump = (test) => {
  let pump = (test ? yellowLED : relay);
    on(pump);
    setTimeout(() => off(pump), 7000);
    console.log((state ? 'off' : 'on'));
    state = (state ? false : true);
};


module.exports = { on, off, runLED, flash, stopFlash, mods, blinkFns, runPump };
