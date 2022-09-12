/**
 * the goal of this file is to keep track of the data needed to
 *  log the daily disarmRecord data.
 */

const EVENTS = require('./socketEvents');

let alarm1;
let alarm2;
let disarmedtime1;
let disarmedtime2;
let success;
let username;

const setAlarm1 = (time) => { alarm1 = time; return alarm1 === undefined; };
const setAlarm2 = (time) => { alarm2 = time; return alarm2 === undefined; };
const setDisarmTime1 = (time) => { disarmedtime1 = time; return disarmedtime1 === undefined; };
const setDisarmTime2 = (time) => { disarmedtime2 = time; return disarmedtime2 === undefined; };
const setSuccess = (successVal) => { success = successVal; return success === undefined; };
const setUsername = (user) => { username = user; return username === undefined; };

const postDisarmRecord = (gotSocket) => {
  const data = {
    date_: new Date().toLocaleDateString(),
    alarm1,
    alarm2,
    disarmedtime1,
    disarmedtime2,
    success,
    username,
  };
  console.log('Posting data @ : ', new Date().toLocaleTimeString(), data);
  gotSocket().emit(EVENTS.POST_DISARM_RECORDS, data);
};

module.exports = {
  setAlarm1,
  setAlarm2,
  setDisarmTime1,
  setDisarmTime2,
  setSuccess,
  setUsername,
  postDisarmRecord,
};
