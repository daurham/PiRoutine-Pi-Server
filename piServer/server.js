const express = require('express');
const axios = require('axios');
const c = require('./controller.js');
const app = express();
const PORT = 4000;
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

app.get('/piRoutines/:table', c.getData);
app.put('/piRoutines/updateAlarm/:oldAlarm/:newAlarm', c.updateAlarm);
app.put('/piRoutines/updateStreak/:oldStreak/:newStreak', c.updateStreak);
app.post('/piRoutine/run', c.runPump);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));