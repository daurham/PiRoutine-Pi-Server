const model = require('../model');

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

module.exports = { postData };
