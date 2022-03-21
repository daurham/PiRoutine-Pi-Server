const relay = require('./relay.js');
// const state = require('./relay.js').state;
const model = require('./model.js');
let state = false;

const runPump = (req, res) => {
  // (state ? relay.off() : relay.on());
  // state = !state;
  // console.log((state ? 'off' : 'on'));
  relay.on();
  setTimeout(function () {
    // (state ? relay.off() : relay.on());
    // state = !state;
    relay.off();
    res.sendStatus(201);
  }, 5000)
};

const getData = (req, res) => {
  let q = 'select * from alarmtime';
  model.getData(q, (err, result) => {
    if (err) { console.log('db err: ', err); res.sendStatus(500); }
    else { console.log(result); res.status(200).send(result); }
  });
};

const postData = (req, res) => {
  let q = `insert into alarmtime (time_, habit, armed) values (?, ?, 1)`;
  model.postData(q, [req.params.time, req.params.habit], (err, result) => {
    if (err) { console.log('db err: ', err); res.sendStatus(500); }
    else { res.sendStatus(201); }
  })
};

const toggleDisarm = (req, res) => {
  let oldVal = Number(req.params.isArmed);
  let q = `update alarmtime set armed = ? where habit = ?`;
  let newVal = (oldVal ? 0 : 1);
  model.toggleDisarm(q, [oldVal, req.params.habit], (err, result) => {
    if (err) { console.log('db err: ', err); res.sendStatus(500); }
    else { console.log(result); res.sendStatus(203); }
  })
};

module.exports = { getData, postData, runPump, toggleDisarm };