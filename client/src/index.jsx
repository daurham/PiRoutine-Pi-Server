import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import Context from './components/Context';
import './fonts/Technology.ttf';
import 'bootstrap/dist/css/bootstrap.min.css';
// import WebFont from 'webfontloader';

// import './fonts/Technology.ttf';
// const init = () => {
//   useEffect(() => {
//     WebFont.load({
//       google: {
//         families: ['Righteous', 'Press Start 2P']
//       }
//     });
//   }, []);
// }

ReactDOM.render(<Context />, document.getElementById('app'));
