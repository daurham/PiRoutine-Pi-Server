/**
 * These tests will aim at testing the speeds at which the client's can update
 *    the their values without stepping on each other's toes.
 *
 * Run:
 *      npm run test -- Clock.test.js
 *    To test Clock.js client
 *
 * Since I currently can't get unsecure websocket (ws from Clock) to make contact with https (EC2),
 *    I'm having to manually sync up these value updates by the time:
 *    fewSecAfterAlarm1  =is=  currentTime. ---> updateVal(Clock) / getVal(EC2)
 *
 * ////////////////////////////////////////////////////////////////////////////////////////////////
 * DIAGRAM:
 * ////////////////////////////////////////////////////////////////////////////////////////////////
 * ALARM1=5:00:00AM,  fewSecAfterAlarm1=5:00:10AM
 * ////////////////////////////////////////////////////////////////////////////////////////////////
 *
 * 5:00:00AM, ... 5:00:10AM
 * PI.1:          ^[Clock]        =>         [Server]  =>  [DB]  =>  [Server]    =>    [Clock].cont
 * Actions:        socket(disarm=true)       Update in DB            io(response)
 *
 * PI.2:          -[Clock]                =>                [Server] => [DB] => [Server] => [Clock]
 * Actions:        socket(response=disarm) -> socket(GET=disarm)  GETfromDB   io(resonse)   Updated
 * ////////////////////////////////////////////////////////////////////////////////////////////////
 *
 *
 * 5:00:00AM, ... 5:00:10AM
 * EC2.1:         ^[EC2]       =>       [Server]   =>  [DB]  =>  [Server]      =>      [EC2]
 *                 GET(request=disarm)  GET from DB              Resonse(disarm)       GOT data
 * ////////////////////////////////////////////////////////////////////////////////////////////////
 * RESULT: EC2 didn't update & alarm with off.
 * ////////////////////////////////////////////////////////////////////////////////////////////////
 *
 * As of now, these tests are observation-based.
 */

/**
 * TESTING | NODE:
 * RUN:
 *      node tests/Clock.test.js
 *
 * This test will demonstrate:
 * - The ability to break out of a test via "breakout function"
 * - The ability to establish a connection from client / server in testing env
 * - The ability to pass in my own testing values
 */

// Server Imports
/* const { io } = require('../server'); */

// Client Imports:
const {
  theCurrentTime,
  makeTime,
  addSeconds,
} = require('../alarmclock/utils');
const {
  Clock,
  socket,
} = require('../alarmclock/Clock');
const { button, yellowLED } = require('../alarmclock/gpio/modules');

// DUMMY DATA:
// Set alarmOne to be 1 min from now
const alarmOneTStamp = makeTime(new Date().getHours(), new Date().getMinutes() + 1);
const alarmOne = alarmOneTStamp.toLocaleTimeString();
// Set alarmTwo to be 10 sec after alarmOne
const alarmTwoTStamp = addSeconds(alarmOneTStamp, 10);
const alarmTwo = alarmTwoTStamp.toLocaleTimeString();
const fewSecIntoAlarmOne = addSeconds(alarmOneTStamp, 3).toLocaleTimeString();
const fewSecIntoAlarmTwo = addSeconds(alarmTwoTStamp, 3).toLocaleTimeString();

const breakOutTime = addSeconds(alarmOneTStamp, 15).toLocaleTimeString();

const callback = () => {
  socket().close();
  console.log('End Of Test.');
  // Close GPIO listeners
  button.unexport();
  yellowLED.unexport();
};
/* ///////////////////////////////////////////////////////////////////// */

// Init Server
/*
io.on('connection', (serverSocket) => {
  serverSocket.on('ended', (val) => {
    console.log('response val:', val);
  });
});
 */

// Init Client / Options
Clock({
  isTest: {
    alarmOne,
    alarmTwo,
    fewSecIntoAlarmOne,
    fewSecIntoAlarmTwo,
  },
  reasonToStop: () => {
    console.log('curTime:', theCurrentTime(), 'breakout @:', breakOutTime);
    socket().emit('ended', 'test');

    return (theCurrentTime() === breakOutTime);
  },
  clockCallback: () => callback(),
});

/*
 * TODO: Incorperate Jest
 * *

const {
  theCurrentTime,
  makeTime,
  addSeconds,
} = require('../alarmclock/utils');
  // parseTimeData,
  // getSecondAlarm,
  // swapBinaryAndBool,
const {
  Clock,
  // alarm1,
  // alarm2,
  // isDisarmed,
  // aFewSecIntoAlarm1,
  socket,
  // streakCount,
} = require('../alarmclock/Clock');

// Server imports
const { io } = require('../server');
// jest.setTimeout(50000);

// describe('Testing on alarmclock / Clock', () => {
// let serverSocket;
// let clientSocket;

// Set alarmOne to be 1 min from now
const alarmOneTStamp = makeTime(new Date().getHours(), new Date().getMinutes() + 1);
const alarmOne = alarmOneTStamp.toLocaleTimeString();
// Set alarmTwo to be 10 sec after alarmOne
const alarmTwoTStamp = addSeconds(alarmOneTStamp, 10);
const alarmTwo = alarmTwoTStamp.toLocaleTimeString();
const fewSecIntoAlarmOne = addSeconds(alarmOneTStamp, 30).toLocaleDateString();

const breakOutTime = addSeconds(alarmOneTStamp, 15).toLocaleTimeString();
// const breakOutOfTest = () => (theCurrentTime() === breakOutTime);

io.on('connection', (servSocket) => {
  // serverSocket = servSocket;
  // console.log(servSocket, serverSocket);
  servSocket.on('ended', (val) => {
    console.log('response val:', val);
  });
});

Clock({
  isTest: { alarmOne, alarmTwo, fewSecIntoAlarmOne },
  reasonToStop: () => {
    console.log('curTime:', theCurrentTime(), 'breakout @:', breakOutTime);
    socket().emit('ended', 'test');
    socket().close();
    return (theCurrentTime() === breakOutTime);
  },
});

*/

/*
  beforeAll((done) => {
    // Assign Sockets
    io.on('connection', (servSocket) => {
      serverSocket = servSocket;
      // console.log(servSocket, serverSocket);
    });
    clientSocket = socket();
    console.log(clientSocket);
    // done();
  });

  afterAll(() => {
    clientSocket.close();
  });

  test(`Should recieve a server socket response at ${theCurrentTime()}`, (done) => {
    serverSocket.on('ended test', (arg) => {
      expect(arg).toBe('test');
    });

    // Invoke Clock
    Clock({
      isTest: { alarmOne, alarmTwo, fewSecIntoAlarmOne },
      reasonToStop: () => {
        console.log('curTime:', theCurrentTime(), 'breakout @:', breakOutTime);
        clientSocket.emit('ended', 'test');
        return (theCurrentTime() === breakOutTime);
      },
    });
    done();
  });
});
// */
