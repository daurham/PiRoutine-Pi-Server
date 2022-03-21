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
// const timeCSS = styled`
//   @font-face {
//     font-family: 'Technology';
//     src: url('../fonts/Technology.ttf') format('ttf'),
//   }
// `;


const App = ({ times, getTime }) => {
  const [currentTime, setCurrentTime] = useState('');
  const [alarmTime, setAlarmTime] = useState();
  const [disfuseTime, setDisfuseTime] = useState();
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
  // const [lon, getUserLon] = useState();
  let clock;
  let interval;
  let isArmed = (isDisarmed ? 'Disfused...' : 'DISARM');
  let goal;
  let userLoc;

  const tConvert = (time) => {
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
    if (time.length > 1) {
      time = time.slice(1);
      time[5] = +time[0] < 12 ? ' AM' : ' PM';
      time[0] = +time[0] % 12 || 12;
    }
    return time.join('');
  };

  const setupAlarmTime = () => {
    // let temptime;
    // let cache = {};
    // if (currentTime.slice(-2) === 'PM') {
    //   temptime = currentTime.slice(0, -3);
    //   temptime + 12
    //   routine.forEach((r) => {
    //     if (r.time_)
    //   })
    // } else {

    // }
    setAlarmTime(() => routines[0].time_)
  };
  const getDifuseTime = () => {
    let d = alarmTime.slice(-2);
    let t = alarmTime.slice(0, -2);
    return t + (d === 'AM' ? 'PM' : 'AM');
  }

  if (alarmTime && !disfuseTime) {
    let d = getDifuseTime();
    console.log('difuse time:', d);
    setDisfuseTime(() => d);
  }

  // take mysql data and allows it to be processed.
  if (times && !routines) {
    if (!once) {
      setRoutines(() => times)
      ignore(() => true);
    }
  }

  if (routines && !alarmTime) {
    setupAlarmTime();
  }

  const handleCurrentTime = () => {
    setCurrentTime(() => new Date().toLocaleTimeString('en-US', { hour12: true }));
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
    setTimeout(function() {
      console.log(userLoc);
      console.log(homeLon);
      let me = String(userLoc).slice(4, 8);
      let home = String(homeLon).slice(4, 8);
      console.log(me);
      console.log(home);
      if (!isDisarmed & Number(me) > (Number(home) + 1)) {
        updateDisarm();
      } else {
        setMsg(() => 'Not Yet..')
      }
    },1000);

  }

  const updateDisarm = () => {
    toggleDisarmed(() => !isDisarmed);
    setStatus(() => 'Keep going.');
    // let val = (isDisarmed ? 0 : 1);
    // axios.put(`/disarm/`)
    // let val = (isDisarmed ? 0 : 1);
    // axios.put(`/disarm/${val}/${routines[0].habit}`)
    //   .then(() => toggleDisarmed(() => !isDisarmed))
    //   .then(() => setStatus(() => 'Keep going.'))
    // .then(() => setRoutines((routines) => routines.slice(1, routines.length)));
  }

  // const enableDisarm = () => {
  //   let colInd = alarmTime.indexOf(':');
  //   let hour = (Number(alarmTime.slice(0, colInd)) - 2);
  //   return hour + ':' + alarmTime.slice(colInd + 1, alarmTime.length);
  // }

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

  const checkAlarmClock = () => {
    // if the timer is within 2 hours of the alarm going off, enable the disarm button.
    // if (currentTime === enableDisarm()) {
    // }
    if (currentTime === disfuseTime) {
      // setRunable(() => true);
      updateDisarm();
      // axios.post('/pi/run');
      // console.log('turning off');
      // }
      // if (alarmTime == 'undefined' || !alarmTime) {
      //   setAlarmMessage(() => "Please set your alarm.");
    }
    if (currentTime.slice(-5, -4) === '5') {
      setMsg(() => 'You can do it!')
    } else {
      setAlarmMessage(() => "Your alarm is set for " + alarmTime + ".");
      // goal = (routines ? routines[0].habit : undefined);
      if (currentTime === alarmTime) {
        // console.log('Times up!');
        // console.log('turning on');
        setStatus(() => 'Do Better...');
        // setRunning(() => true);
        axios.post('/pi/run');
      // } else {
      }
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
  }, [currentTime, alarmTime, routines]);



  return (!routines || !currentTime || !alarmMessage) ? <Spinner /> : (

    <AppnContainer className="Technology">

      <Container>
        <Header style={{ fontFamily: 'Righteous' }}>{status}</Header>
      </Container>
      <Container>
        <Header style={{ fontFamily: 'Righteous' , color: 'red'}}>
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