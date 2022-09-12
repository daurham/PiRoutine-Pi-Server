const db = require('../database');

const updateData = (q, d, cb) => {
  db.query(q, d, cb);
};

module.exports = { updateData };
