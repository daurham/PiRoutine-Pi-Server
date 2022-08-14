const { Gpio } = require('onoff');

const relay = new Gpio(25, 'out');
const yellowLED = new Gpio(22, 'out'); // 3.3Vs, 2.1Vf, 20mA(If) == 60| = using 47r
const button = new Gpio(23, 'in', 'both');
// const greenLED = new Gpio(24, 'out'); // 3.3Vs, 2.1Vf, 20mA(If) == 60r| = using 47r
// const redLED = new Gpio(23, 'out'); // 3.3Vs, 2Vf, 20mA(If) == 65r| = using 47r
// const blueLED = new Gpio(4, 'out'); // 5Vs, 3.6Vf, 30mA(If) == 47r| = using 47r/cant3.3
// const whiteLED = new Gpio(27, 'out'); // 5Vs, 3.6Vf, 30mA(If) == 47r| = using 47r/cant3.3

module.exports = {
  Gpio,
  yellowLED,
  relay,
  button,
};
