const db = require('../database');

const postData = (q, d, cb) => {
  db.query(q, d, cb);
};

module.exports = { postData };
