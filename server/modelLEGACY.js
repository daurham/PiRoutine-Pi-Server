const db = require('./database');

const getData = (q, cb) => {
  db.query(q, cb);
};
const updateData = (q, d, cb) => {
  db.query(q, d, cb);
};
const postDisarmRecord = (q, d, cb) => {
  db.query(q, d, cb);
};

module.exports = {
  getData,
  updateData,
  postDisarmRecord,
};
