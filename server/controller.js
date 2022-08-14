const model = require('./model');
// const { toggleMod, onClick, runPump } = require('./pi-UI/gpio').helpers;
// const { yellowLED } = require('./pi-UI/gpio/modules');

// stretched goal: include code to send an email / text to myself?
const notifyErr = (req, res) => {
  console.log('HTTP Error:', new Date().toLocaleTimeString());
  res.sendStatus(201);
};

const getData = (req, res, internal, cb) => {
  let query;
  if (internal) {
    if (internal.source === 'alarmtime') query = 'select * from alarmtime';
    if (internal.source === 'streakcount') query = 'select * from streakcount';
    if (internal.source === 'isdefused') query = 'select * from isdefused';
    model.getDate(query, (err, result) => {
      if (err) {
        console.log('Error getting data from db:', err);
      } else {
        cb(result);
      }
    });
  } else {
    // PIROUTINE.COM
    const { table } = req.params; // must be alarmtime, streakcount or isdefused
    query = `select * from ${table}`;
    model.getData(query, (err, result) => {
      if (err) { // client handling
        console.log('Error getting data from db:', err);
        res.sendStatus(500);
      } else {
        console.log(result);
        res.status(200).send(result);
      }
    });
  }
};

const updateAlarm = (req, res, internal, cb) => {
  const query = 'update alarmtime set hour=?, minute=?, tod=?'; // TODO: Refact DB to accept TOD.
  if (internal) {
    const { data } = internal;
    model.updateAlarm(query, data, (err, result) => {
      if (err) {
        console.log('Error updating time from db:', err);
        cb(err); // FIX ME put rebound data
      } else {
        cb(result);
      }
    });
  } else {
    // PIROUTINE.COM
    const data = [Number(req.params.hour), Number(req.params.minute), req.params.tod];
    model.updateAlarm(query, data, (err, result) => {
      if (err) {
        console.log('Error updating time from db:', err);
        res.sendStatus(500);
      } else {
        res.status(203).send(result);
      }
    });
  }
};

const updateStreak = (req, res, internal, cb) => {
  const query = 'update streakcount set streak=?';
  if (internal) {
    const { data } = internal;
    model.updateStreak(query, data, (err, result) => {
      if (err) {
        console.log('Error updating streak from db:', err);
        cb(err); // FIX ME put rebound data
      } else {
        cb(result);
      }
    });
  } else {
    // PIROUTINE.COM
    const data = [Number(req.params.newStreak)];
    model.updateStreak(query, data, (err, result) => {
      if (err) {
        console.log('Error updating streak from db:', err);
        res.sendStatus(500);
      } else {
        res.status(203).send(result);
      }
    });
  }
};

const updateDefusal = (req, res, cb, internal) => {
  const query = 'update isdefused set defusal=?';
  if (internal) {
    const { data } = internal;
    model.updateDefusal(query, data, (err, result) => {
      if (err) {
        console.log('Error updating isdefused from db:', err);
        cb(err);
      } else {
        cb(result);
      }
    });
  } else {
    // PIROUTINE.COM
    const data = [Number(req.params.newVal)];
    model.updateDefusal(query, data, (err, result) => {
      if (err) {
        console.log('Error updating isdefused from db:', err);
        res.sendStatus(500);
      } else {
        res.status(203).send(result);
      }
    });
  }
};

// TESTING
const distanceMet = (req, res) => {
  console.log(new Date().toString());
  res.sendStatus(200);
};

module.exports = {
  getData,
  updateAlarm,
  // runThePump,
  updateStreak,
  updateDefusal,
  distanceMet,
  notifyErr,
};
