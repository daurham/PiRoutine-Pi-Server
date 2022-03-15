import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';


// const success = (position) => {
//   const latitude = position.coords.latitude;
//   const longitude = position.coords.longitude;
//   // if (!loc) {
//     // setLoc(() => latitude + longitude);
//   // }
//   console.log(latitude + longitude)
//   return longitude + latitude;
// };

// const failure = () => {
//   console.log('failure');
// }

// const loc = navigator.geolocation.getCurrentPosition(success, failure);

ReactDOM.render(<App />, document.getElementById('app'));
