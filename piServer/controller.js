// const { on } = require('./database/index.js');
const model = require('./model.js');
const gpios = require('./gpios.js');
const relay = gpios.modules.relay;
const g = gpios.modules.greenLED;
const r = gpios.modules.redLED;
const y = gpios.modules.yellowLED;
const on = gpios.on;
const off = gpios.off;
const blinkG = gpios.blinkFns.blinkG;
const blinkR = gpios.blinkFns.blinkR;
const blinkY = gpios.blinkFns.blinkY;
const dance = gpios.blinkFns.dance;
let gd = gpios.runLED(g, blinkG, 1000);
let rd = gpios.runLED(r, blinkR, 1000);
let yd = gpios.runLED(y, blinkY, 1000);

let state = false;



const runPump = (req, res) => {
  on(r);
  setTimeout(() => { off(r) }, 7000);
  console.log((state ? 'off' : 'on'));
  state = (state ? false : true);
  // on(r);
  res.sendStatus(201);
};

const notifyErr = (req, res) => {
  on(y);
  console.log('Error found, triggering LED.', new Date().toString());
  // stretched goal: include code to send an email / text to myself?
  res.sendStatus(201);
};

const getData = (req, res) => {
  let q = (req.params.table === 'alarmtime' ? 'select * from alarmtime' : 'select * from streakcount');
  model.getData(q, (err, result) => {
    if (err) { console.log('db err: ', err); res.sendStatus(500); }
    else { console.log(result); res.status(200).send(result); }
  });
};

const updateAlarm = (req, res) => {
  let q = 'update alarmtime set hour=?, minute=?';
  console.log(req.body);
  let data = [Number(req.body.newAlarm.h), Number(req.body.newAlarm.m), Number(req.body.oldAlarm.h), Number(req.body.oldAlarm.m)];
  model.updateAlarm(q, data, (err, result) => {
    if (err) { console.log('db err: ', err); res.sendStatus(500); }
    else { res.status(203).send(result); }
  })
};

const updateStreak = (req, res) => {
  let q = `update streakcount set streak=?`;
  let data = [Number(req.params.newStreak), Number(req.params.oldStreak)];
  model.updateStreak(q, data, (err, result) => {
    if (err) { console.log('db err: ', err); res.sendStatus(500); }
    else { console.log(result, new Date().toString()); res.status(203).send(result); }
  })
};

const distanceMet = (req, res) => {
  console.log(new Date().toString());
  res.sendStatus(200)
}

module.exports = { getData, updateAlarm, runPump, updateStreak, distanceMet, notifyErr };




// const gpios = require('./gpios.js');
// // const state = require('./gpios.js').state;
// const model = require('./model.js');
// let state = false;

// const runPump = (req, res) => {
//   // (state ? gpios.off() : gpios.on());
//   // state = !state;
//   console.log((state ? 'off' : 'on'));
//   gpios.on();
//   setTimeout(function () {
//     // (state ? gpios.off() : gpios.on());
//     // state = !state;
//     gpios.off();
//     res.sendStatus(201);
//   }, 5000)
// };

// const getData = (req, res) => {
//   let q = 'select * from alarmtime';
//   model.getData(q, (err, result) => {
//     if (err) { console.log('db err: ', err); res.sendStatus(500); }
//     else { console.log(result); res.status(200).send(result); }
//   });
// };

// const postData = (req, res) => {
//   let q = `insert into alarmtime (time_, habit, armed) values (?, ?, 1)`;
//   model.postData(q, [req.params.time, req.params.habit], (err, result) => {
//     if (err) { console.log('db err: ', err); res.sendStatus(500); }
//     else { res.sendStatus(201); }
//   })
// };

// const toggleDisarm = (req, res) => {
//   let oldVal = Number(req.params.isArmed);
//   let q = `update alarmtime set armed = ? where habit = ?`;
//   let newVal = (oldVal ? 0 : 1);
//   model.toggleDisarm(q, [oldVal, req.params.habit], (err, result) => {
//     if (err) { console.log('db err: ', err); res.sendStatus(500); }
//     else { console.log(result); res.sendStatus(203); }
//   })
// };

// module.exports = { getData, postData, runPump, toggleDisarm };