const model = require('./model');
const { setQuery, setData } = require('./utils');

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

const postData = (disarmRecord) => {
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
  const query = 'INSERT INTO disarmrecords (date_, alarm1, alarm2, disarmedtime1, disarmedtime2, success, username) VALUES (?, ?, ?, ?, ?, ?, ?)';
  model.postDisarmRecord(query, data, (err) => {
    if (err) {
      console.error('Error POSTED disarmRecord into db: ', err);
    } else {
      // console.log('Successfully POSTED data to db.disarmRecord: ', result);
    }
  });
};

module.exports = {
  getData,
  updateData,
  postData,
};
