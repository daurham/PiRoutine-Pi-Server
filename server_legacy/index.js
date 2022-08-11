const express = require('express');
const { getData, updateAlarm, updateStreak, updateDefusal, runThePump, notifyErr, distanceMet } = require('./controller.js');
// import { getData, updateAlarm, updateStreak, updateDefusal, runThePump, notifyErr, distanceMet } from './controller.js';
const { App, getCurrentTime, getCurrentStreak, getDefuseStatus } = require('./timer/time_functionality');

const app = express();
const PORT = 3000;


app.use(express.urlencoded({ extended: true }))
app.use(express.json());

App();

app.get('/piRoutine/:table', getData);
app.put('/piRoutine/updateAlarm/:hour/:minute/:tod', (req, res) => updateAlarm(req, res, getCurrentTime));
app.put('/piRoutine/updateStreak/:newStreak', (req, res) => updateStreak(req, res, getCurrentStreak));
app.put('/piRoutine/updateDefusal/:newVal', (req, res) => updateDefusal(req, res, getDefuseStatus));
app.post('/piRoutine/run', runThePump);
app.post('/piRoutine/err', notifyErr);
app.get('/', distanceMet);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
