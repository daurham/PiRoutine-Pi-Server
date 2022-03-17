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

app.get('/pi', (req, res) => {
  res.status(200).send(lox);
});

app.get('/alarm', (req, res) => {
  console.log('getting alarm data');
  axios.get('http://192.168.0.164:4000/piRoutines')
    .then((result) => res.status(200).send(result.data))
    .catch((err) => console.log('Issue getting data: ', err));
});
app.post('/setup', (req, res) => {
  console.log('getting alarm data');
  let data = req.body;
  console.log(data);
  axios.post(`http://192.168.0.164:4000/piRoutines/${data.time}/${data.routine}`)
    .then((result) => res.status(201).send(result.data))
    .catch((err) => console.log('Issue getting data: ', err));
});
app.put('/disarm/:isArmed/:routine', (req, res) => {
  console.log('updating alarm data');
  axios.put(`http://192.168.0.164:4000/piRoutines/${req.params.isArmed}/${req.params.routine}`)
    .then((result) => res.status(201).send(result.data))
    .catch((err) => console.log('Issue getting data: ', err));
});

app.post('/pi/run', (req, res) => {
  console.log('reached local server!, Now requesting the Pi');
  axios.post('http://192.168.0.164:4000/piRun');
  res.sendStatus(201);
});


app.listen(PORT, () => console.log(`Listening on port ${PORT}`));