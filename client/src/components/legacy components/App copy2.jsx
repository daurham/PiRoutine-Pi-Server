import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import axios from 'axios';
import Habit from './Habit';
import Spinner from './Spinner';
import css from './css.css';
// import WebFont from 'webfontloader';
import font from '../font.css';
import Technology from '../fonts/Technology.ttf';
import { Temporal, Intl, toTemporalInstant } from '@js-temporal/polyfill';



const App = ({ times, getTime }) => {
  const [currentTime, setCurrentTime] = useState('');
  // const [alarmTime, setAlarmTime] = useState();
  // const [alarmTimeTwo, setAlarmTimeTwo] = useState();
  // const [disfuseTime, setDisfuseTime] = useState();
  const [status, setStatus] = useState('Pump is Armed.');
  const [isDisarmed, toggleDisarmed] = useState(false);
  const [alarmMessage, setAlarmMessage] = useState('');
  const [routines, setRoutines] = useState();
  const [input, setInput] = useState();
  const [inputTime, setInputTime] = useState('');
  const [once, ignore] = useState(false);
  const [canRun, setRunable] = useState(false);
  const [homeLon, getFreshHomeLon] = useState(112.1105918);
  const [userLon, getUserLon] = useState();
  const [msg, setMsg] = useState();
  const [currAlarmTime, setCurrAlarmTime] = useState();
  const [canDifuseTime1, setCanDifuseTime1] = useState();
  const [canDifuseTime2, setCanDifuseTime2] = useState();
  // const [alarms, setAlarms] = useState();
  // const [lon, getUserLon] = useState();
  let clock;
  let interval;
  let isArmed = (isDisarmed ? 'Disfused...' : 'DISARM');
  let goal;
  let userLoc;
  // set it up to get it dynamically
  let alarm1Hour = 6;
  let alarm2Hour = 6;
  let alarm1Min = 6;
  let alarm2Min = 6;
  let alarm1Sec = 6;
  let alarm2Sec = 6;
  let alarm1TOD = 'AM';
  let alarm2TOD = 'AM';



  let alarmTime1 = `${alarm1Hour}:05:00 AM`;
  let alarmTime2 = `${alarm2Hour}:12:00 AM`;
  let difuseTime1 = `${alarm1Hour}:05:00 PM`;
  let difuseTime2 = `${alarm2Hour}:06:00 AM`;
  let resetTime1 = `${alarm1Hour}:30:00 PM`;
  let resetTime2 = `${alarm2Hour}:15:00 AM`;

  const tConvert = (time) => {
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
    if (time.length > 1) {
      time = time.slice(1);
      time[5] = +time[0] < 12 ? ' AM' : ' PM';
      time[0] = +time[0] % 12 || 12;
    }
    return time.join('');
  };

  // const setupAlarmTime = () => {
  //   // setAlarmTime(() => routines[0].time_)
  //   // setAlarmTimeTwo(() => routines[1].time_)
  //   alarmTime1 = routines[0].time_;
  //   alarmTime2 = routines[1].time_;
  //   let d = alarmTime1.split('').splice(-5, 1, '3');
  //   console.log(3);
  //   difuseTime2 = d;
  //   setCurrAlarmTime(() => alarmTime1);
  // };
  // const getDifuseTime = (time) => {
  //   // 12hr difuse time
  //   // let d = alarmTime.slice(-2);
  //   // let t = alarmTime.slice(0, -2);
  //   // return t + (d === 'AM' ? 'PM' : 'AM');

  //   let d = time.slice(-2);
  //   console.log(d);
  //   let t = time.slice(0, -2);
  //   return t + (d === 'AM' ? 'PM' : 'AM');
  // }

  // if (alarmTime1 && !disfuseTime) {
  //   let d = getDifuseTime();
  //   console.log('difuse time:', d);
  //   setDisfuseTime(() => d);
  // }

  // take mysql data and allows it to be processed.
  // if (times && !routines) {
  //   if (!once) {
  //     setRoutines(() => times)
  //     ignore(() => true);
  //   }
  // }

  // if (routines && !alarmTime1) {
  //   setupAlarmTime();
  // }

  const handleCurrentTime = () => {
    setCurrentTime(() => new Date().toLocaleTimeString('en-US', { hour12: true }));
  };




  const success = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const coords = latitude + longitude;
    userLoc = Math.abs(longitude);
    getUserLon(() => longitude);
  };
  const failure = () => {
    console.log('failed to get coords');
  }
  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(success, failure);
  };
  // const handleInputTime = (e) => {
  //   e.preventDefault();
  //   const inputAlarmTimeModified = e.target.value + ':00';
  //   let inpTime = tConvert(inputAlarmTimeModified);
  //   setInputTime(() => inpTime);
  // }

  // const handleRoutine = (e) => {
  //   setInput(() => e.target.value);
  // }
  // const handleRoutineSubmit = (e) => {
  //   e.preventDefault();
  //   const data = { time: inputTime, routine: input || 'N/A' };
  //   axios.post('/setup', data)
  //     .then(() => getTime());
  // };


  const handleDisarm = () => {
    getLocation();
    setTimeout(function () {
      console.log(userLoc);
      console.log(homeLon);
      let me = String(userLoc).slice(4, 8);
      let home = String(homeLon).slice(4, 8);
      console.log(me);
      console.log(home);

      if (canDifuseTime1 && !isDisarmed) {
        updateDisarm();
      }
      if (canDifuseTime2 && !isDisarmed && Number(me) > (Number(home) + 1)) {
        updateDisarm();
      }
      // // if (currentTime === alarmTime2) {
      // if (!isDisarmed && Number(me) > (Number(home) + 1)) {
      //   updateDisarm();
      //   // }
      // } else if (!isDisarmed) {
      //   updateDisarm();
      // } else {
      //   setMsg(() => 'Not Yet..')
      // }
    }, 1000);

  }

  const updateDisarm = () => {
    toggleDisarmed(() => !isDisarmed);
    setStatus(() => 'Keep going.');
    if (currAlarmTime === alarmTime1) {
      setCurrAlarmTime(() => alarmTime2);
    } else {
      setCurrAlarmTime(() => alarmTime1);
    }
  }
    // let val = (isDisarmed ? 0 : 1);
    // axios.put(`/disarm/`)
    // let val = (isDisarmed ? 0 : 1);
    // axios.put(`/disarm/${val}/${routines[0].habit}`)
    //   .then(() => toggleDisarmed(() => !isDisarmed))
    //   .then(() => setStatus(() => 'Keep going.'))
    // .then(() => setRoutines((routines) => routines.slice(1, routines.length)));

  // const enableDisarm = () => {
  //   let colInd = alarmTime.indexOf(':');
  //   let hour = (Number(alarmTime.slice(0, colInd)) - 2);
  //   return hour + ':' + alarmTime.slice(colInd + 1, alarmTime.length);
  // }
  if (!currAlarmTime) {
    setCurrAlarmTime(() => alarmTime1);
  }



  const checkAlarmClock = () => {
    // if the timer is within 2 hours of the alarm going off, enable the disarm button.

    if (currentTime === difuseTime1) {
      setCanDifuseTime1(() => true);
    }
    if (currentTime === difuseTime2) {
      setCanDifuseTime2(() => true);
    }
    if (currentTime === resetTime1) {
      setCanDifuseTime1(() => false);
    }
    if (currentTime === resetTime2) {
      setCanDifuseTime2(() => false);
    }
    // updateDisarm();

    // if (currentTime === disfuseTime) {
      // setRunable(() => true);
      // axios.post('/pi/run');
      // console.log('turning off');
      // }
      // if (alarmTime == 'undefined' || !alarmTime) {
      //   setAlarmMessage(() => "Please set your alarm.");
    // }
    if (currentTime.slice(-5, -4) === '5') {
      setMsg(() => 'You can do it!')
    }
    // } else {
    setAlarmMessage(() => "Your alarm is set for " + currAlarmTime + ".");
    if (currentTime === alarmTime1 && !isDisarmed) {
      setStatus(() => 'Do Better...');
      axios.post('/pi/run');
    }
    if (currentTime === alarmTime2 && !isDisarmed) {
      setStatus(() => 'Do Better...');
      axios.post('/pi/run');
    }
  }

// const failsafe = () => {
//   axios.post('/pi/run');
// }

// const demo = () => {
//   setAlarmTime(() => currentTime)
//   getDifuseTime();
//   axios.post('/pi/run');
// }

// console.log('a:', alarmTime, 'd:', disfuseTime);
useEffect(() => {
  clock = setInterval(() => handleCurrentTime(), 1000);
  interval = setInterval(() => checkAlarmClock(), 1000);
  return () => {
    clearInterval(clock);
    clearInterval(interval);
  }
}, [currentTime]);
// useEffect(() => {
//   clock = setInterval(() => handleCurrentTime(), 1000);
//   interval = setInterval(() => checkAlarmClock(), 1000);
//   return () => {
//     clearInterval(clock);
//     clearInterval(interval);
//   }
// }, [currentTime, currAlarmTime, routines]);



return (!currentTime || !alarmMessage) ? <Spinner /> : (
  // return (!routines || !currentTime || !alarmMessage) ? <Spinner /> : (

  <AppnContainer className="Technology">

    <Container>
      <Header style={{ fontFamily: 'Righteous' }}>{status}</Header>
    </Container>
    <Container>
      <Header style={{ fontFamily: Technology, color: 'red' }}>
        {currentTime}
      </Header>
      {/* <timeCSS>{currentTime}</timeCSS> */}
    </Container>
    <Container>
      <Subheader style={{ fontFamily: 'Righteous' }}>{alarmMessage}</Subheader>
      {/* <Subheader style={{ fontFamily: 'Righteous' }}>{goal ? goal : null}</Subheader> */}
    </Container>
    <ButtonContainer>
      <DisarmButton onClick={handleDisarm}><HeaderB>{isArmed}</HeaderB></DisarmButton>
    </ButtonContainer>
    {/* <Container> */}
    {/* <form> */}
    {/* <input onChange={handleInputTime} type="time"></input> */}
    {/* <InputBar onChange={handleRoutine} type="text"></InputBar> */}
    {/* <input onClick={handleRoutineSubmit} type="submit"></input> */}
    {/* </form> */}
    {/* </Container> */}
    <Container>
      <ListContainer>
        <Subheader>
          {msg}
        </Subheader>
        {/* <List> */}
        {/* {routines.length < 2 ? null : <h3 style={{ fontFamily: 'Righteous' }}>Upcoming Routines</h3>} */}
        {/* {routines.length < 2 ? null : (routines.map((t, index) => ( */}
        {/* // <Habit key={index} habit={t} currentTime={currentTime} /> */}
        {/* // )))} */}
        {/* </List> */}
      </ListContainer>
    </Container>
    {/* <button onClick={failsafe}>failsafe</button> */}
    {/* <button onClick={demo}>demo 10sec</button> */}
  </AppnContainer>

)
}


export default App;


const Location = styled.h1`
`;
const Header = styled.h1`
font-size: 5rem;
`;
const HeaderB = styled.h1`
font-size: 5rem;
color: white;
`;
const Subheader = styled.h2`
font-size: 3rem;
`;
const InputBar = styled.input`
size: 400%;
`;

// width: 90%;
// height: 100%;
// background-color: rgb(56, 55, 61);
const DisarmButton = styled.button`
background-color: black;
padding: 10px 60px;
border-radius: 20px;
margin: 10px 0px;

width: 79vw;
height: 30vh;
  cursor: pointer;
`;

const AppnContainer = styled.div`
  display: block;
  justify-content: center;
  `;
// width: 80vw;
// height: 50hw;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  `;
// width: 80vw;
// height: 20rem;
const ListContainer = styled.div`
  display: block;
  justify-content: center;
`;
const List = styled.ul`
  justify-content: center;
`;
const Container = styled.div`
  display: flex;
  justify-content: center;
`;