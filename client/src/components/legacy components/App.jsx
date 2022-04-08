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
// import 'bootstrap';
import { ProgressBar } from 'react-bootstrap';
import convert from './convert';
import { useData } from './Context';



// const now = Temporal.Now.plainTimeISO(); //
// console.log(now.toString().slice(0, 8));
// console.log(alarmTime.hour); // 6
// console.log(now.hour); // 6
// const alarmTime = new Temporal.PlainTime(6, 5); // 06:05:00
// const activeTime = alarmTime.subtract({ hours: 1 }); // 05:05:00
// const alarmTime2 = alarmTime.add({ minutes: 7 }); // 06:12:00
// console.log(activateTime.toString()); //
// console.log(activeTime2.toString());
// console.log(alarmTime.toString());

// console.log(now.toString().slice(0, 8));
// let tod = (now.hour > 11 ? 'PM' : 'AM');
// let time = `${now.hour}:${now.minute}:${now.second} ${tod}`
// console.log('time:', time); //



// let currentPhase = 'inactive';
// const getPhase = () => {
//   if (currentTime === convert(activeTime)) {
//     currentPhase = 'active';
//   }
//   if (currentTime === convert(alarmTime.add({ minutes: 1 }))) {
//     currentPhase = 'inactive';
//   }
//   return;
// }

// if (currentPhase === 'active') {
//   if (currentTime === convert(alarmTime) || currentTime === convert(alarmTime2)) {
//     // trigger the alarm
//   }
// }


// const convert = (t = null) => { // turns a temporal date obj into a readable time.
//   t = t || now;
//   console.log(t);
//   return `${(t.hour > 12 ? t.hour % 12 : t.hour)}:${(t.minute < 10 ? String('0' + t.minute) : t.minute)}:${(t.second < 10 ? String('0' + t.second) : t.second)} ${(t.hour > 11 ? 'PM' : 'AM')}`
// };


// // identify the current phase:
// let active = false;
// // determine if phase is active
// const isActive = (alarmTime) => {
//   if ((now.hour >= activeTime.hour && now.hour < alarmTime.hour) || // if within a safe hour block or
//     (now.hour === alarmTime.hour && now.minute > alarmTime.minute || // if during alarm hour, its within a safe min / sec block
//       (now.hour === alarmTime.hour && now.minute === alarmTime.minute && now.second > alarmTime.second))) { // if current time is within the active block.
//     active = true;
//   } else {
//     active = false;
//   }
// };






// const convert = (t = null) => { // turns a temporal date obj into a readable time.
//   t = t || now;
//   return `${(t.hour > 12 ? t.hour % 12 : t.hour)}:${(t.minute < 10 ? String('0' + t.minute) : t.minute)}:${(t.second < 10 ? String('0' + t.second) : t.second)} ${(t.hour > 11 ? 'PM' : 'AM')}`
// };



const App = () => {
  // const { latitude, longitude, time } = useData(); // works
  // console.log(latitude, time);

  const now = Temporal.Now.plainTimeISO(); // move to context
  // let alarmTime = new Temporal.PlainTime(6, 5); // 06:05:00
  const [alarmTime, setAlarmTime] = useState(new Temporal.PlainTime(6, 5)); // move to context
  const [initialAlarmTime, setInitialAlarmTime] = useState(alarmTime); // move to context
  // if (!alarmTime) {
  // return;
  // }
  // console.log(alarmTime);
  let activeTime = alarmTime.subtract({ hours: 1 }); // 05:05:00
  // const alarmTime2 = alarmTime.add({ minutes: 7 }); // 06:12:00

  const [status, setStatus] = useState('Stick to your goals');
  const [currentTime, setCurrentTime] = useState(''); // move to context
  const [isDisarmed, toggleDisarmed] = useState(false);
  const [alarmMessage, setAlarmMessage] = useState('');
  const [currAlarmTime, setCurrAlarmTime] = useState(convert(alarmTime));
  const [currentAlarm, setCurrentAlarm] = useState(1);
  const [active, setActive] = useState(true);
  const [distance, setDistance] = useState(0); // move to context

  let clock;
  let interval;
  let isArmed = (isDisarmed ? 'LOCKED' : 'DISARM');


  const switchAlarms = () => { // runs after button is pressed.
    setCurrentAlarm(() => (currentAlarm === 1 ? 2 : 1));
  }



  const handleCurrentTime = () => {
    setCurrentTime(() => convert(Temporal.Now.plainTimeISO()));
  };


  // identify the current phase:
  // determine if phase is active
  const isActive = (aTime) => {
    if (((now.hour >= aTime.hour - 2) && now.hour < aTime.hour) || // if within a safe hour block or
      (now.hour === aTime.hour && now.minute < aTime.minute) || // if during alarm hour, its within a safe min / sec block
      (now.hour === aTime.hour && now.minute === aTime.minute && now.second < aTime.second)) { // if current time is within the active block.
      // console.log('should open');
      if (!active) {
        setActive(() => true);
      }
    } else {
      // console.log('should close');
      if (active) {
        setActive(() => false);
      }
    }
  };

  // run after progressBar is filled.
  const handleProgressBar = () => { // enables button to be clicked again and diffuses alarm
  }

  const statusGenerator = () => { // randomly returns a positive phrase
    let phrases = ['Make them proud', 'Keep it up', 'Keep proving you\'ve had enough', 'Keep crushing it!', 'Captain the fuck out this day!', 'Stick to your goals', 'Trust your wiser self', 'Keep going cap'];
    let r = Math.floor(Math.random() * (phrases.length));
    console.log(phrases[r]);
    return phrases[r];
  };


  const handleDisarm = () => {
    if (isDisarmed) {
      return;
    } else {
      if (currentAlarm === 1) { // first alarm defused
        setStatus(() => 'Nice, Now lets get moving!');
        setAlarmTime(() => alarmTime.add({ minutes: 7 }));
        switchAlarms();
        toggleDisarmed(() => true);
      } else if (currentAlarm === 2) { // second alarm defused
        setStatus(() => statusGenerator())
        setAlarmTime(() => initialAlarmTime);
        setDistance(() => 0);
        switchAlarms();
      }
    }
  };

  const demo = () => { setAlarmTime(() => now.add({ minutes: 1 })) }



  const checkAlarmClock = () => {
    if (currentAlarm === 2) {
      if (distance < 100) {
        setDistance(() => distance + 5); // remove after testing
        //
      }
      if (distance === 100) {
        toggleDisarmed(() => false);
      }
    }
    isActive(alarmTime);
    setAlarmMessage(() => "Your alarm is set for " + convert(alarmTime) + ".");
    if (currentTime === convert(alarmTime)) {
      setStatus(() => 'Do Better...');
      // axios.post('/pi/run'); // uncomment when ready for testing
      console.log('get wet bish!');
    }
  }

  useEffect(() => {
    clock = setInterval(() => handleCurrentTime(), 1000);
    interval = setInterval(() => checkAlarmClock(), 1000);
    return () => {
      clearInterval(clock);
      clearInterval(interval);
    }
  }, [currentTime]);


  return (!currentTime || !alarmMessage) ? <Spinner /> : (

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
      {active ?
        <ButtonContainer>
          <DisarmButton onClick={handleDisarm}><HeaderB>{isArmed}</HeaderB></DisarmButton>
        </ButtonContainer>
        : null}
      {active ?
        (currentAlarm === 2 ?
        <ProgressBar now={distance} label={`${distance}%`} />
          : null)
          : null}
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
            {status}
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
      <button onClick={demo}>demo 10sec</button>
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