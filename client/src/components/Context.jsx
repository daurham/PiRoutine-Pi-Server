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
  if (!time) {
    getAlarmTime();
  }

  useEffect(() => {
  }, [time])

  return !time ? <Spinner /> : (
    <App times={time} getTime={() => {getAlarmTime()}}/>
  );
};

export default Context;