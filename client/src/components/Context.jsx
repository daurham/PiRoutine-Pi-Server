import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import axios from 'axios';
import App from './App';
import Spinner from './Spinner';

const Context = () => {
  const [time, setTime] = useState();

  // get alarm data
  const getAlarmTime = () => {
    axios.get('/alarm')
      .then((res) => { setTime(() => res.data) })
      .catch((err) => console.log('err?: ', err));
  };
  // uncomment:
  // if (!time) {
  //   getAlarmTime();
  // }

  useEffect(() => {
  }, [time])

  // delete testing code:
  if (!time) {
    setTime(() => [
      {'time_': '6:05:00 AM', 'habit': 'Wake Up'},
      {'time_': '6:12:00 AM', 'habit': 'Run'}
  ]);
  }

  return !time ? <Spinner /> : (
    <App times={time} getTime={getAlarmTime}/>
  );
};

export default Context;