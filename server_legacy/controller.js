const model = require('./model.js');
const { updateClientsAlarm, updateClientsDefuseStatus, updateClientsStreak } = require('./backend-client');
const { mods, on, off, blinkFns, runLED, runPump } = require('./Gpio/index.js');
const relay = mods.relay;
const g = mods.greenLED;
const r = mods.redLED;
const y = mods.yellowLED;
const blinkG = blinkFns.blinkG;
const blinkR = blinkFns.blinkR;
const blinkY = blinkFns.blinkY;
const dance = blinkFns.dance;
let gd = () => runLED(g, blinkG, 1000);
let rd = () => runLED(r, blinkR, 1000);
let yd = () => runLED(y, blinkY, 1000);

// let state = false;



const runThePump = (req, res) => {
  gpios.runPump('test'); // test == Yellow LED
  console.log('running');
  res.sendStatus(201);
};

const notifyErr = (req, res) => {
  // on(y);
  console.log('Error found, triggering LED.', new Date().toString());
  // stretched goal: include code to send an email / text to myself?
  res.sendStatus(201);
};

const getData = (req, res = null) => {
  let q;
  if (res) q = (req.params.table === 'alarmtime' ? 'select * from alarmtime' : (req.params.table === 'streakcount' ? 'select * from streakcount' : 'select * from isdefused'));
  if (!res) q = (req.table === 'alarmtime' ? 'select * from alarmtime' : (req.table === 'streakcount' ? 'select * from streakcount' : 'select * from isdefused'));
  model.getData(q, (err, result) => {
    if (res) { // client handling
      if (err) { console.log('db err: ', err); res.sendStatus(500); }
      else { console.log(result); res.status(200).send(result); }
    } else { // backend handling
      if (err) console.log('db err: ', err);
      console.log(result); req.cb(result);
    }
  });
};

const updateAlarm = (req, res, updateBackend) => {
  console.log('________________________________________');
  // let q = 'update alarmtime set hour=?, minute=?, tod=?'; TODO: Refact DB to accept TOD.
  let q = 'update alarmtime set hour=?, minute=?';
  console.log('new alarm Data: ', req.params);
  let data = [Number(req.params.hour), Number(req.params.minute), req.params.tod];
  console.log('updating alarm to: ', data);
  model.updateAlarm(q, data, (err, result) => {
    // if (err) { console.log('db err: ', err); res.sendStatus(500); } // Normal code
    if (err) { console.log('db err: ', err); res.sendStatus(500); } // Test code
    else { updateBackend(); res.status(203).send(result); }
  })
};

const updateStreak = (req, res = null, updateBackend) => {
  let data;
  if (res) data = [Number(req.params.newStreak)];
  if (!res) data = [Number(req.newStreak)];
  let q = `update streakcount set streak=?`;
  console.log('updating streak: ', data);
  model.updateStreak(q, data, (err, result) => {
    if (res) { // client handling
      if (err) { console.log('db err: ', err); res.sendStatus(500); }
      else { console.log('Streak updated:', result, new Date().toString()); updateBackend(); res.status(203).send(result); }
    } else { // backend handling
      if (err) console.error('db err: ', err);
      console.log('Streak updated @:', new Date().toString()); //req.cb(result); //updateClientsStreak(); // replace req.cb with backend-client functions.
    }
  })
};

const updateDefusal = (req, res = null, updateBackend) => {
  let data;
  if (res && !req.params.newVal) data = [1];
  if (res && req.params.newVal) data = [Number(req.params.newVal)];
  if (!res) data = [Number(req.newVal)];
  let q = `update isdefused set defusal=?`;
  model.updateDefusal(q, data, (err, result) => {
    if (res) { // client handling
      // if (err) { console.log('db err: ', err); res.sendStatus(500); } // Normal code
      if (err) { res.sendStatus(500); } // Testing code
      else { console.log(result, new Date().toString()); updateBackend(); res.status(203).send(result); }
    } else { // backend handling
      if (err) console.log('db err: ', err);
      console.log('Updating Defusal @', new Date().toString().slice(0, 12)); req.cb(); //updateClientsDefuseStatus(); // replace req.cb with backend-client functions.
    }
  })
};

const distanceMet = (req, res) => {
  console.log(new Date().toString());
  res.sendStatus(200)
}

module.exports = { getData, updateAlarm, runThePump, updateStreak, updateDefusal, distanceMet, notifyErr };




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
