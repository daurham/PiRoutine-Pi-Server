const express = require('express');
const axios = require('axios');
const c = require('../controller.js');
const app = express();
const PORT = 3000;
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
const Gpio = require('onoff').Gpio;
let state = false;

const relay = new Gpio(24, 'out');

const off = () => { relay.writeSync(0); state = false; };

const on = () => { relay.writeSync(1); state = true; };

app.get('/', (req, res) => res.sendStatus(200));

app.post('/piRoutine/run', (req, res) => {
  on();
  setTimeout(function () {
    off();
    res.sendStatus(201);
  }, 7000)
});
app.post('/piOn', (req, res) => {
  on();
  res.sendStatus(201);
});
app.post('/piOff', (req, res) => {
  off();
  res.sendStatus(201);
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
