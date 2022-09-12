const { setQuery, setData } = require('../utils');
const model = require('../model');

const updateData = (req, res, opts, cb) => {
  const { table, column, alarmclock } = opts;
  const data = setData(table, opts.data);
  const query = setQuery(table, opts.data, 'PATCH');
  model.updateData(query, data, (err, result) => {
    if (err) {
      console.error(`Error updating db.${table}.${column} from db:`, err);
      if (alarmclock) cb(err);
      if (!alarmclock) res.sendStatus(500);
    } else {
      // console.log(`Successfully UPDATED data from db.${table}.${column}: `, result);
      cb(result);
      if (!alarmclock) res.sendStatus(203);
    }
  });
};

module.exports = { updateData };
