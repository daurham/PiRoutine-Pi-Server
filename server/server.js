const express = require('express');
const path = require('path');
const http = require('http');
const axios = require('axios');
// const gpio = require('onoff').Gpio;
const logger = require('./locationLogs.js');
const app = express();
const PORT = 3000;
const DIST_DIR = path.join(__dirname, '../client/dist');

const controller = require('./controller');

app.use(express.static(DIST_DIR));
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

let lox;
app.post('/pi', (req, res) => {
  lox = String(req.body.loc);
logger(String(req.body.loc), req.body.des);
  res.sendStatus(201);
});

// app.get('/pi', (req, res) => {
//   res.status(200).send(lox);
// });

app.get('/alarmTime', (req, res) => {
  console.log('getting alarm data');
  axios.get(`http://192.168.0.164:3000/piRoutine/${'alarmtime'}`)
    .then((result) => res.status(200).send(result.data))
    .catch((err) => console.log('Issue getting data: ', err));
});
app.get('/streak', (req, res) => {
  // console.log('getting streak data');
  axios.get(`http://192.168.0.164:3000/piRoutine/${'streakcount'}`)
    .then((result) => res.status(200).send(result.data))
    .catch((err) => console.log('Issue getting data: ', err));
});
app.put('/updateAlarm', (req, res) => {
  // console.log('getting alarm data');
  let data = req.body;
  console.log('updating alarm: ',data);
  axios.put(`http://192.168.0.164:3000/piRoutine/updateAlarm/${data.oldAlarm}/${data.newAlarm}`, data)
    .then((result) => res.status(203).send(result.data))
    .catch((err) => console.log('Issue getting data: ', err));
});
app.put('/streak/:oldStreak/:newStreak', (req, res) => {
  console.log('updating streaks: ', req.params.oldStreak);
  // console.log('updating alarm data');
  axios.put(`http://192.168.0.164:3000/piRoutine/updateStreak/${req.params.oldStreak}/${req.params.newStreak}/`)
    .then((result) => res.status(203).send(result.data))
    .catch((err) => console.log('Issue getting data: ', err));
});

app.post('/pi/run', (req, res) => { // run water
  console.log('reached local server!, Now requesting the Pi');
  axios.post('http://192.168.0.164:3000/piRoutine/run');
  res.sendStatus(201);
});


app.listen(PORT, () => console.log(`Listening on port ${PORT}`));