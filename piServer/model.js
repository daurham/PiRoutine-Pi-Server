const db = require('./database/index.js');

const getData = (q, cb) => {
  db.query(q, cb);
};
const postData = (q, d, cb) => {
  db.query(q, d, cb);
};
const toggleDisarm = (q, d, cb) => {
  db.query(q, d, cb);
};

module.exports = { getData, postData, toggleDisarm };