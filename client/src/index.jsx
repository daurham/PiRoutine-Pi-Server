import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import Context from './components/Context';
import WebFont from 'webfontloader';
// import css from './css.css';
const init = () => {
  useEffect(() => {
    WebFont.load({
      google: {
        families: ['Righteous', 'Press Start 2P']
      }
    });
  }, []);
}

ReactDOM.render(<Context />, document.getElementById('app'));
