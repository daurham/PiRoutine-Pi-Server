const model = require('./model');
// const { toggleMod, onClick, runPump } = require('./pi-UI/gpio').helpers;
// const { yellowLED } = require('./pi-UI/gpio/modules');

// stretched goal: include code to send an email / text to myself?
const notifyErr = (req, res) => {
  console.log('HTTP Error:', new Date().toLocaleTimeString());
  res.sendStatus(201);
};

const getData = (req, res, alarmclockReq, cb) => {
  let query;
  if (alarmclockReq) {
    const { table } = alarmclockReq;
    query = `select * from ${table}`; // alarmtime, streakcount, isdisarmed
    model.getData(query, (err, result) => {
      if (err) {
        console.log('Error getting data from db:', err);
      } else {
        cb(result);
      }
    });
  } else {
    // PIROUTINE.COM
    const { table } = req.params; // must be alarmtime, streakcount or isdisarmed
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

const updateAlarm = (req, res, alarmclockReq, cb) => {
  const query = 'update alarmtime set hour=?, minute=?, tod=?'; // TODO: Refact DB to accept TOD.
  // ALARMCLOCK
  if (alarmclockReq) {
    const { data } = alarmclockReq;
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
        cb(result);
        res.status(203).send(result);
      }
    });
  }
};

const updateDisarmStatus = (req, res, cb, alarmclockReq) => {
  const query = 'update isdisarmed set disarmedstatus=?';
  // ALARMCLOCK
  if (alarmclockReq) {
    const { data } = alarmclockReq;
    console.log(model);
    model.updateDisarmStatus(query, [data], (err, result) => {
      if (err) {
        console.log('Error updating isdisarmed from db:', err);
        cb(err);
      } else {
        cb(result);
      }
    });
  } else {
    // PIROUTINE.COM
    const data = [Number(req.params.newStatus)];
    model.updateDisarmStatus(query, [data], (err, result) => {
      if (err) {
        console.log('Error updating isdisarmed from db:', err);
        res.sendStatus(500);
      } else {
        cb(result);
        res.status(203).send(result);
      }
    });
  }
};

const updateStreak = (req, res, alarmclockReq, cb) => {
  // ALARMCLOCK
  const query = 'update streakcount set streak=?';
  if (alarmclockReq) {
    const { data } = alarmclockReq;
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
        cb(result);
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
  updateDisarmStatus,
  distanceMet,
  notifyErr,
};
