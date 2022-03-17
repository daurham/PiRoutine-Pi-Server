const Gpio = require('onoff').Gpio;
let state = false;

const relay = new Gpio(25, 'out');

const off = () => { relay.writeSync(0); state = false; };

const on = () => { relay.writeSync(1); state = true; };

module.exports = { on, off, state };