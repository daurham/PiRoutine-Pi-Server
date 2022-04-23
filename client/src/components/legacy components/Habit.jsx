import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import axios from 'axios';

const Habit = ({ habit, currentTime }) => {
  // console.log(currentTime);
  return (
    <div style={{fontFamily: 'Righteous', 'display': 'flex', 'justifyContent': 'center'}}>{habit.habit} | {habit.time_}</div>
  );
}

export default Habit;