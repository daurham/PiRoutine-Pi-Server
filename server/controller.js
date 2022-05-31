const model = require('./model.js');
const { updateClientsAlarm, updateClientsDefuseStatus, updateClientsStreak } = require('./backend-client');
// const gpios = require('./gpios.js');
// const relay = gpios.modules.relay;
// const g = gpios.modules.greenLED;
// const r = gpios.modules.redLED;
// const y = gpios.modules.yellowLED;
// const on = gpios.on;
// const off = gpios.off;
// const blinkG = gpios.blinkFns.blinkG;
// const blinkR = gpios.blinkFns.blinkR;
// const blinkY = gpios.blinkFns.blinkY;
// const dance = gpios.blinkFns.dance;
// let gd = gpios.runLED(g, blinkG, 1000);
// let rd = gpios.runLED(r, blinkR, 1000);
// let yd = gpios.runLED(y, blinkY, 1000);

// let state = false;



const runPump = (req, res) => {
// gpios.runPump('test'); // test == Yellow LED
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
  // console.log(req)
  let q = 'update alarmtime set hour=?, minute=?';
  console.log(req.body);
  let data = [Number(req.body.newAlarm.h), Number(req.body.newAlarm.m), Number(req.body.oldAlarm.h), Number(req.body.oldAlarm.m)];
  console.log(data);
  model.updateAlarm(q, data, (err, result) => {
    if (err) { console.log('db err: ', err); res.sendStatus(500); }
    else { updateBackend(); res.status(203).send(result); } 
  })
};

const updateStreak = (req, res = null, updateBackend) => {
  let data;
  if (res) data = [Number(req.params.newStreak), Number(req.params.oldStreak)];
  if (!res) data = [Number(req.newStreak), Number(req.oldStreak)];
  let q = `update streakcount set streak=?`;
  model.updateStreak(q, data, (err, result) => { 
    if (res) { // client handling
      if (err) { console.log('db err: ', err); res.sendStatus(500); } 
      else { console.log(result, new Date().toString()); updateBackend(); res.status(203).send(result); }
    } else { // backend handling
      if (err) console.log('db err: ', err);
      console.log(result, new Date().toString()); req.cb(result); updateClientsStreak(); // replace req.cb with backend-client functions.
    }
    })
};

const updateDefusal = (req, res = null) => {
  let data;
  if (res) data = [Number(req.params.newVal), Number(req.params.oldVal)];
  if (!res) data = [Number(req.newVal), Number(req.oldVal)];
  let q = `update isDefused set defusal=?`;
  model.updateDefusal(q, data, (err, result) => { 
    if (res) { // client handling
      if (err) { console.log('db err: ', err); res.sendStatus(500); } 
      else { console.log(result, new Date().toString()); updateBackend(); res.status(203).send(result); }
    } else { // backend handling
      if (err) console.log('db err: ', err);
      console.log(result, new Date().toString()); req.cb(result); updateClientsDefuseStatus(); // replace req.cb with backend-client functions.
    }
    })
};

const distanceMet = (req, res) => {
  console.log(new Date().toString());
  res.sendStatus(200)
}

module.exports = { getData, updateAlarm, runPump, updateStreak, updateDefusal, distanceMet, notifyErr };




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
