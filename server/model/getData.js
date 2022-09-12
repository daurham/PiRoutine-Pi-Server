const db = require('../database');

const getData = (q, cb) => {
  db.query(q, cb);
};

module.exports = { getData };
