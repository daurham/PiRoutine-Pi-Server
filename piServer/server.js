const express = require('express');
const axios = require('axios');
const c = require('./controller.js');
const app = express();
const PORT = 4000;
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

app.get('/piRoutines', c.getData);
app.post('/piRun', c.runPump);
app.post('/piRoutines/:time/:habit', c.postData);
app.put('/piRoutines/:isArmed/:habit', c.toggleDisarm);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));