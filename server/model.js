const db = require('./database');

const getData = (q, cb) => {
  db.query(q, cb);
};
const updateAlarm = (q, d, cb) => {
  db.query(q, d, cb);
};
const updateStreak = (q, d, cb) => {
  db.query(q, d, cb);
};
const updateDefusal = (q, d, cb) => {
  db.query(q, d, cb);
};

module.exports = {
  getData,
  updateAlarm,
  updateStreak,
  updateDefusal,
};
