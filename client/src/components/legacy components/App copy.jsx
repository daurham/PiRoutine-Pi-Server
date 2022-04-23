// import React, { useEffect, useState } from 'react';
// import ReactDOM from 'react-dom';
// import styled from 'styled-components';
// import axios from 'axios';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      currentTime: '',
      alarmTime: '',
      status: 'Pump is Armed.'
    };
    this.setAlarmTime = this.setAlarmTime.bind(this);
    this.tConvert = this.tConvert.bind(this);
  }

  componentDidMount() {
    this.clock = setInterval(() => this.setCurrentTime(), 1000);
    this.interval = setInterval(() => this.checkAlarmClock(), 1000);
    this.state.status;
  }

  componentWillUnmount() {
    clearInterval(this.clock);
    clearInterval(this.interval);
  }

  tConvert = (time) => {
    // Check correct time format and split into components
    time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) { // If time format correct
      time = time.slice (1);  // Remove full string match value
      time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join (''); // return adjusted time or original string
  }

  setCurrentTime() {
    this.setState({
      currentTime: new Date().toLocaleTimeString('en-US', {
        hour12: true
      })
    });
  }

  setAlarmTime(event) {
    event.preventDefault();
    console.log(event.target.value);
    console.log(this.state.currentTime);
    const inputAlarmTimeModified = event.target.value + ':00';
    this.setState({
      alarmTime: this.tConvert(inputAlarmTimeModified)
    });
  }

  checkAlarmClock() {
    if (this.state.alarmTime == 'undefined' || !this.state.alarmTime) {
      this.alarmMessage = "Please set your alarm.";
    } else {
      this.alarmMessage = "Your alarm is set for " + this.state.alarmTime + ".";

      if (this.state.currentTime === this.state.alarmTime) {
        // alert("its time!");
        console.log('Times up!');
        this.setState({status: "Do Better."});
        axios.post('/pi/run');
      } else {
        console.log("not yet", this.state.currentTime, " =/= ", this.state.alarmTime);
        console.log(this.state.currentTime === this.state.alarmTime);
        console.log(typeof this.state.currentTime, typeof this.state.alarmTime);
      }
    }
  }

  render() {
    return (
      <div>
        <h1>{this.state.status}</h1>
        <h2>It is {this.state.currentTime}.</h2>
        <h2>{this.alarmMessage}</h2>
        <form>
          <input type="time" onChange={this.setAlarmTime}></input>
        </form>
      </div>
    )
  }
}

// export default App;
