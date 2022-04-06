import React, { useEffect, useState, useMemo, useContext } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import axios from 'axios';
import App from './App';
import Spinner from './Spinner';
import useGeolocation from "./useGeolocation";
import { Temporal, Intl, toTemporalInstant } from '@js-temporal/polyfill';
import convert from './convert';

const DataContext = React.createContext();

export function useData() {
  return useContext(DataContext);
}

const Context = () => {
  const {
    loading,
    error,
    data: { latitude, longitude },
  } = useGeolocation();
  const [time, setTime] = useState();
  const [changeLat, getChangeLat] = useState(0);
  const [changeLon, getChangeLon] = useState(0);
  const [initialLat, setInitialLat] = useState(latitude);
  const [initialLon, setInitialLon] = useState(longitude);
  const [once, setOnce] = useState(false);
  const [distance, updateDistance] = useState(0);
  const [alarmTime, setAlarmTime] = useState();
  const [streak, setStreak] = useState();
  let interval;
  let clock;

  if (!once && latitude && longitude) {
    setInitialLat(() => latitude);
    setInitialLon(() => longitude);
    setOnce(() => true);
  }
  const dConvert = (input) => Math.floor(((input - 0) * 100) / (.003 - 0));

  let dif = (c, l, i, cb, ccb) => {
    if (i !== l) {
      if (l) {
        let v = c + Math.abs(Math.abs(i) - Math.abs(l));
        ccb(() => v);
        cb(() => l);
      }
    }
  };


  // get alarm data
  const getAlarmTime = () => {
    axios.get('/alarm')
      .then((res) => { setTime(() => res.data) })
      .catch((err) => console.log('err?: ', err));
  };
  const getStreak = () => {
    axios.get('/streak')
      .then((res) => { setStreak(() => res.data[0]) })
      .catch((err) => console.log('err?: ', err));
  };

  // uncomment:
  // useEffect(() => {
  // if (!alarmTime) {
  //   getAlarmTime();
  // }
  // if (!streak) {
  //   getStreak();
  // }
  // }, [])

  useEffect(() => {
    dif(changeLat, latitude, initialLat, setInitialLat, getChangeLat);
    dif(changeLon, longitude, initialLon, setInitialLon, getChangeLon);
    updateDistance(() => dConvert(changeLat));
  }, [latitude, time]);


  const handleCurrentTime = () => {
  setTime(() => convert(Temporal.Now.plainTimeISO()));
  };
  useEffect(() => {
    clock = setInterval(() => handleCurrentTime(), 1000);
    // interval = setInterval(() => checkAlarmClock(), 1000);
    return () => {
      clearInterval(clock);
      // clearInterval(interval);
    }
  }, [time]);

  // // delete testing code:
  // if (!time) {
  //   setTime(() => convert(now));
  // }

  const value = useMemo(() => ({
    time, distance, latitude, longitude, streak, time, alarmTime
  }), [time]);

  // console.log(time);
  return !time ? <Spinner /> : (
    <DataContext.Provider value={value}>
      <App />
    </DataContext.Provider>
  );
};

export default Context;