const gpios = require('./gpios.js');
const model = require('./model.js');
let state = false;

const runPump = (req, res) => {
  gpios.on();
  state = true;
  console.log((state?'off':'on'));
  setTimeout(function () {
    gpios.off();
    state = false;
    console.log((state?'off':'on'));
    res.sendStatus(201);
  }, 7000)
};

const getData = (req, res) => {
  let q = 'select * from ?';
  model.getData(q, [req.params.table], (err, result) => {
    if (err) { console.log('db err: ', err); res.sendStatus(500); }
    else { console.log(result); res.status(200).send(result); }
  });
};

const updateAlarm = (req, res) => {
  let q = `update alarmtime set hour = ?, minute = ? where hour = ?, minute = ?`;
  let data = [Number(req.params.newAlarm.hour), Number(req.params.newAlarm.minute), Number(req.params.oldAlarm.hour), Number(req.params.oldAlarm.minute)];
  model.updateAlarm(q, data, (err, result) => {
    if (err) { console.log('db err: ', err); res.sendStatus(500); }
    else { res.sendStatus(201); }
  })
};

const updateStreak = (req, res) => {
  let q = `update streakcount set streak = ? where streak = ?`;
  let data = [Number(req.params.newStreak), Number(req.params.oldStreak)];
  model.updateStreak(q, data, (err, result) => {
    if (err) { console.log('db err: ', err); res.sendStatus(500); }
    else { console.log(result); res.sendStatus(203); }
  })
};

module.exports = { getData, updateAlarm, runPump, updateStreak };