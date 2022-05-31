const express = require('express');
const axios = require('axios');
const c = require('./controller.js');
const convert = require('./timer/convert');
const utils = require('./timer/utils');
const App = utils.App;
const getCurrentAlarm = utils.getCurrentTime;
const getCurrentStreak = utils.getCurrentStreak;
const getDefuseStatus = utils.getDefuseStatus;
// const defuseAlarm = utils.defuseAlarm;
// let isDefused = utils.isDefused;
const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }))
app.use(express.json());

App();

// app.post('/', (req, res) => {
//   console.log(req.body);
//   // console.log(isDefused);
//   // let input = convert(req.body.data);
//   let input = (req.body.data);

//   console.log(input);
//   addAlarmTime(input);
//   res.sendStatus(201);
// });

// app.post('/piRoutine/defuse', (req, res) => {
//   defuseAlarm();
//   res.sendStatus(201);
// });
app.get('/', c.distanceMet);
app.get('/piRoutine/:table', c.getData); 
app.put('/piRoutine/updateAlarm', (req, res) => c.updateAlarm(req, res, getCurrentAlarm)); // pass in a flag that will run backend getCurrTime/Streak() if cleint updates, and pass in the functions
app.put('/piRoutine/updateStreak/:oldStreak/:newStreak', (req, res) => c.updateStreak(req, res, getCurrentStreak));
app.put('/piRoutine/updateDefusal/:oldVal/:newVal', (req, res) => c.updateDefusal(req, res, getDefuseStatus));
app.post('/piRoutine/run', c.runPump);
app.post('/piRoutine/err', c.notifyErr);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
