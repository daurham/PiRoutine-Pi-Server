const express = require('express');
const axios = require('axios');
const c = require('./controller.js');
const app = express();
const PORT = 3000;
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

app.get('/', c.distanceMet);
app.get('/piRoutine/:table', c.getData);
app.put('/piRoutine/updateAlarm/:oldAlarm/:newAlarm', c.updateAlarm);
app.put('/piRoutine/updateStreak/:oldStreak/:newStreak', c.updateStreak);
app.post('/piRoutine/run', c.runPump);
app.post('/piRoutine/err', c.notifyErr);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
