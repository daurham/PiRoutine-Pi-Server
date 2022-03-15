const express = require('express');
const path = require('path');
const http = require('http');
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
  // res.sendStatus(200);
  console.log(lox);
  res.status(200).send(lox);
});




app.listen(PORT, () => console.log(`Listening on port ${PORT}`));