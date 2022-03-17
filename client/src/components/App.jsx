import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import axios from 'axios';
import Habit from './Habit';
import Spinner from './Spinner';
import css from './css.css';
import WebFont from 'webfontloader';

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
  const [running, setRunning] = useState(false);
  let clock;
  let interval;
  let isArmed = (isDisarmed ? 'Disfused...' : 'DISARM');
  let goal;

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
    let d = alarmTime.split('')
    let n = Number(alarmTime.slice(-5, -6));
    console.log(n);
    d.splice(-5, 1, `${n+1}`);
    d = d.join('');
    console.log(d);
    return d;
  }

  if (alarmTime && !disfuseTime) {
    let d = getDifuseTime();
    console.log(d);
    setDisfuseTime(() => d);
  }

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

  const handleInputTime = (e) => {
    e.preventDefault();
    const inputAlarmTimeModified = e.target.value + ':00';
    let inpTime = tConvert(inputAlarmTimeModified);
    setInputTime(() => inpTime);
  }

  const handleRoutine = (e) => {
    setInput(() => e.target.value);
  }
  const handleRoutineSubmit = (e) => {
    e.preventDefault();
    const data = { time: inputTime, routine: input || 'N/A' };
    axios.post('/setup', data)
      .then(() => getTime());
  };

  const handleDisarm = () => {
    if (!isDisarmed) {
      updateDisarm();
    }
  }

  const updateDisarm = () => {
    let val = (isDisarmed ? 0 : 1);
    axios.put(`/disarm/${val}/${routines[0].habit}`)
      .then(() => toggleDisarmed(() => !isDisarmed))
      .then(() => setStatus(() => 'Keep going.'))
    // .then(() => setRoutines((routines) => routines.slice(1, routines.length)));
  }

  const enableDisarm = () => {
    let colInd = alarmTime.indexOf(':');
    let hour = (Number(alarmTime.slice(0, colInd)) - 2);
    return hour + ':' + alarmTime.slice(colInd + 1, alarmTime.length);
  }

  const checkAlarmClock = () => {
    // if the timer is within 2 hours of the alarm going off, enable the disarm button.
    if (currentTime === enableDisarm()) {
      updateDisarm();
    }
    if (currentTime === disfuseTime && running) {
      setRunning(() => false);
      axios.post('/pi/run');
      console.log('turning off');
    }
    if (alarmTime == 'undefined' || !alarmTime) {
      setAlarmMessage(() => "Please set your alarm.");
    } else {
      setAlarmMessage(() => "Your alarm is set for " + alarmTime + ".");
      goal = (routines ? routines[0].habit : undefined);
      if (currentTime === alarmTime) {
        console.log('Times up!');
        console.log('turning on');
        setStatus(() => 'Do Better.');
        setRunning(() => true);
        axios.post('/pi/run');
      } else {
      }
    }
  }

  const failsafe = () => {
    axios.post('/pi/run');
  }

  const demo = () => {
    setAlarmTime(() => currentTime)
    getDifuseTime();
    axios.post('/pi/run');
  }

  // console.log('a:', alarmTime, 'd:', disfuseTime);
  useEffect(() => {
    clock = setInterval(() => handleCurrentTime(), 1000);
    interval = setInterval(() => checkAlarmClock(), 1000);
    return () => {
      clearInterval(clock);
      clearInterval(interval);
    }
  }, [currentTime, alarmTime, alarmMessage, routines]);




  return (!routines || !currentTime || !alarmMessage) ? <Spinner /> : (

    <AppnContainer className="font1">

      <Container>
        <Header style={{ fontFamily: 'Righteous' }}>{status}</Header>
      </Container>
      <Container>
        <Header style={{ fontFamily: 'Righteous' }}>{currentTime}</Header>
      </Container>
      <Container>
        <Subheader style={{ fontFamily: 'Righteous' }}>{alarmMessage}</Subheader>
        <Subheader style={{ fontFamily: 'Righteous' }}>{goal ? goal : null}</Subheader>
      </Container>
      <ButtonContainer>
        <DisarmButton onClick={handleDisarm}>{isArmed}</DisarmButton>
      </ButtonContainer>
      <Container>
        <form>
          <input onChange={handleInputTime} type="time"></input>
          <input onChange={handleRoutine} type="text"></input>
          <input onClick={handleRoutineSubmit} type="submit"></input>
        </form>
      </Container>
      <Container>
        <ListContainer>
          <List>
            {routines.length < 2 ? null : <h3 style={{ fontFamily: 'Righteous' }}>Upcoming Routines</h3>}
            {routines.length < 2 ? null : (routines.map((t, index) => (
              <Habit key={index} habit={t} currentTime={currentTime} />
            )))}
          </List>
        </ListContainer>
      </Container>
      <button onClick={failsafe}>failsafe</button>
      <button onClick={demo}>demo 10sec</button>
    </AppnContainer>

  )
}
// <div>
//   <h1>{status}</h1>
//   <h2>It is {currentTime}.</h2>
//   <h2>{alarmMessage}</h2>
//   <form>
//     <input type="time" onChange={handleAlarmTime}></input>
//   </form>
//     <button onClick={handleDisarm}>{isArmed}</button>
// </div>

export default App;

const Location = styled.h1`
`;
const Header = styled.h1`
`;
const Subheader = styled.h2`
`;

// width: 90%;
// height: 100%;
const DisarmButton = styled.button`
width: 400;
height: 200;
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