const model = require('./model');
const { adjustInputTime } = require('./utils');

const notifyErr = (req, res) => {
  console.log('HTTP Error:', new Date().toLocaleTimeString());
  res.sendStatus(201);
};

const getData = (req, res, alarmclockReq, cb) => {
  let query;
  if (alarmclockReq) {
    console.log('get in alarmclock');
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
    const { table } = req.query; // will be alarmtime, streakcount or isdisarmed
    query = `select * from ${table}`;
    model.getData(query, (err, result) => {
      if (err) { // client handling
        console.log('Error getting data from db:', err);
        res.sendStatus(500);
      } else {
        // console.log(result);
        res.status(200).send(result);
      }
    });
  }
};

const updateAlarm = (req, res, alarmclockReq, cb) => {
  const query = 'update alarmtime set hour=?, minute=?, tod=?';
  // ALARMCLOCK
  if (alarmclockReq) {
    const { hour, minute, tod } = alarmclockReq.data;
    model.updateAlarm(query, [hour, minute, tod], (err, result) => {
      if (err) {
        console.log('Error updating time from db:', err);
        cb(err);
      } else {
        cb(result);
      }
    });
  } else {
    // PIROUTINE.COM
    console.log(req.body);
    const { hour, minute, tod } = adjustInputTime(req.body);
    console.log('hour, min, tod:', hour, minute, tod);
    model.updateAlarm(query, [hour, minute, tod], (err, result) => {
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

const updateDisarmStatus = (req, res, alarmclockReq, cb) => {
  const query = 'update isdisarmed set disarmedstatus=?';
  // ALARMCLOCK
  if (alarmclockReq) {
    const { data } = alarmclockReq;
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
    const { data } = req.body;
    console.log('going int disarm db:', data);
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
    // console.log('going int streak db:', data);
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
    const { data } = req.body;
    console.log(data);
    model.updateStreak(query, [data], (err, result) => {
      // console.log('req', req.body, cb);
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
  updateStreak,
  updateDisarmStatus,
  distanceMet,
  notifyErr,
};
