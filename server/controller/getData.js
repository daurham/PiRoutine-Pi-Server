const { setQuery } = require('../utils');
const model = require('../model');

const getData = (req, res, opts, cb) => {
  const { table, alarmclock } = opts;
  const query = setQuery(table, null, 'GET');
  model.getData(query, (err, result) => {
    if (err) {
      console.error(`Error getting data from db.${table}: `, err);
      if (alarmclock) cb(err);
      if (!alarmclock) res.sendStatus(500);
    } else {
      // console.log(`Successfully GOT data from db.${table}: `, result);
      if (alarmclock) cb(result);
      if (!alarmclock) res.status(200).send(result);
    }
  });
};

module.exports = { getData };
