const model = require('./model');
const { adjustInputTime } = require('./utils');

const notifyErr = (req, res) => {
  console.log('HTTP Error:', new Date().toLocaleTimeString());
  res.sendStatus(201);
};

const getData = (req, res, options, cb) => {
  let query;
  if (options.alarmclock) {
    console.log('get in alarmclock');
    const { table } = options;
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
    const { table } = req.query; // will be alarmtime, streakcount or isdisarmed,
    query = `select * from ${table}`;
    if (table === 'users') query = `select * from ${table} where username = 'daurham'`;
    // console.log(query);
    model.getData(query, (err, result) => {
      if (err) { // client handling
        console.error(`Error getting data from ${table}`, err);
        if (res === 'local') {
          cb(err);
        } else {
          res.sendStatus(500);
        }
      } else {
        console.log('got data from: ', table);
        if (res === 'local') {
          cb(result);
        } else {
          console.log(table, ' data: ', result);
          res.status(200).send(result);
        }
      }
    });
  }
};

// DYNAMIC UPDATEDATA FUNCTION UNDER CONSTRUCTION:
const updateData = (req, res, options, cb) => {
  let query; // = 'update alarmtime set hour=?, minute=?, tod=?';
  let table;
  let column;
  let data;
  if (options.alarmclock) {
    if (options.alarmclock) {
      data = options.data;
    } else {
      data = options.data;
    }
    if (!options.alarmclock) data = req.body.data;
    model.updateData(query, data, (err, result) => {
      if (err) {
        console.log(`Error updating ${table}.${column} from db:`, err);
        cb(err);
      } else {
        cb(result);
      }
    });
  } else {
    // PIROUTINE.COM
    console.log('Recieving data: ', req.body); // { data: [] }
    let { data } = req.body;
    if (table === 'alarmtime') data = adjustInputTime(data);
    console.log('Data from req.body: ', data);
    model.updateData(query, data, (err, result) => {
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

const updateAlarm = (req, res, options, cb) => {
  const query = 'update alarmtime set hour=?, minute=?, tod=?';
  // ALARMCLOCK
  if (options.alarmclock) {
    const { hour, minute, tod } = options.data;
    model.updateData(query, [hour, minute, tod], (err, result) => {
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
    model.updateData(query, [hour, minute, tod], (err, result) => {
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

const updateDisarmStatus = (req, res, options, cb) => {
  const query = 'update isdisarmed set disarmedstatus=?';
  // ALARMCLOCK
  if (options.alarmclock) {
    const { data } = options;
    model.updateData(query, [data], (err, result) => {
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
    model.updateData(query, [data], (err, result) => {
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

const updateStreak = (req, res, options, cb) => {
  // ALARMCLOCK
  let query = 'update streakcount set streak=?';
  if (options.alarmclock) {
    const { data } = options;
    // console.log('going int streak db:', data);
    model.updateData(query, data, (err, result) => {
      if (err) {
        console.log('Error updating streak from db:', err);
        cb(null, err); // FIX ME put rebound data
      } else {
        cb(result);
      }
    });
  } else {
    // PIROUTINE.COM

    getData({ query: 'streakcount' }, 'local', null, (err, result) => {
      if (err) {
        console.log('err in getting streak count', err);
      } else {
        // [ { id:1, streak: 5, maxstreak: 0 } ] = result;
        const { maxstreak } = result[0];
        const streak = req.body.data;
        if (maxstreak < streak) {
          query = 'INSERT INTO streakcount (id, streak, maxstreak) values (1, ?, ?)';
          const data = [1, streak, streak];
          console.log('updating streak & maxstreak:', streak, maxstreak);
          model.updateData(query, data, (err2, result2) => {
            if (err2) {
              console.log('Error updating streak from db:', err2);
              res.sendStatus(500);
            } else {
              cb(result2);
              res.status(203).send(result2);
            }
          });
          // ELSE MAX STREAK ISNT LESS THAN STREAK
        } else {
          console.log('updating streak only. streak & max:', streak, maxstreak);
          model.updateData(query, [streak], (err3, result3) => {
            if (err3) {
              console.log('Error updating streak from db:', err3);
              res.sendStatus(500);
            } else {
              cb(result3);
              res.status(203).send(result3);
            }
          });
        }
      }
    });
  }
};

const updateSkippedCount = (req, res, options, cb) => {
  const query = 'update skippedcount set skipped=?';
  // ALARMCLOCK
  if (options.alarmclock) {
    const { data } = options;
    model.updateData(query, [data], (err, result) => {
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
    model.updateData(query, [data], (err, result) => {
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

const updateSoakedCount = (req, res, options, cb) => {
  const query = 'update soakedcount set soaked=?';
  // ALARMCLOCK
  if (options.alarmclock) {
    const { data } = options;
    model.updateData(query, [data], (err, result) => {
      if (err) {
        console.log('Error updating soakedcount from db:', err);
        cb(err);
      } else {
        cb(result);
      }
    });
  } else {
    // PIROUTINE.COM
    const { data } = req.body;
    console.log('going into soakedcount db:', data);
    model.updateData(query, [data], (err, result) => {
      if (err) {
        console.log('Error updating soakedcount from db:', err);
        res.sendStatus(500);
      } else {
        cb(result);
        res.status(203).send(result);
      }
    });
  }
};

const updateSkippedDate = (req, res, options, cb) => {
  const query = 'update skippedcount set skipdate=?';
  // PIROUTINE.COM
  const { data } = req.body; // { date: 'mm/dd/yyyy' }
  console.log('req.body:', req.body);
  console.log('going into skippedcount.skipdate db:', data);
  model.updateData(query, [data], (err, result) => {
    if (err) {
      console.log('Error updating isdisarmed from db:', err);
      res.sendStatus(500);
    } else {
      cb(result);
      res.status(203).send(result);
    }
  });
};

const postData = (disarmRecord, cb) => {
  const {
    date_,
    alarm1,
    alarm2,
    disarmedtime1,
    disarmedtime2,
    success,
    username,
  } = disarmRecord;
  const data = [date_, alarm1, alarm2, disarmedtime1, disarmedtime2, success, username];
  console.log('posting data: ', data);
  const query = 'INSERT INTO disarmrecords (date_, alarm1, alarm2, disarmedtime1, disarmedtime2, success, username) VALUES (?, ?, ?, ?, ?, ?, ?)';
  model.postDisarmRecord(query, data, (err, result) => {
    if (err) {
      console.error('Error posting disarmRecord into db: ', err);
      cb(500, err);
    } else {
      cb(201, result);
    }
  });
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
  updateSkippedCount,
  updateSkippedDate,
  updateSoakedCount,
  postData,
  distanceMet,
  notifyErr,
};
