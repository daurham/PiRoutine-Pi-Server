const db = require('./database');

const getData = (q, cb) => {
  db.query(q, cb);
};
const updateData = (q, d, cb) => { // Can reuse this 1 function & delete rest
  db.query(q, d, cb);
};

// const updateAlarm = (q, d, cb) => {
//   db.query(q, d, cb);
// };
// const updateStreak = (q, d, cb) => {
//   db.query(q, d, cb);
// };
// const updateDisarmStatus = (q, d, cb) => {
//   db.query(q, d, cb);
// };
// const updateSkippedCount = (q, d, cb) => {
//   db.query(q, d, cb);
// };
// const updateSkippedDate = (q, d, cb) => {
//   db.query(q, d, cb);
// };
// const updateSoakedCount = (q, d, cb) => {
//   db.query(q, d, cb);
// };

const postDisarmRecord = (q, d, cb) => {
  db.query(q, d, cb);
};

module.exports = {
  getData,
  updateData,
  // updateAlarm,
  // updateStreak,
  // updateDisarmStatus,
  // updateSkippedCount,
  // updateSkippedDate,
  // updateSoakedCount,
  postDisarmRecord,
};
