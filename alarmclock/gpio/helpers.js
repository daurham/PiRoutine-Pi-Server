const helpersClosure = ({ relay, yellowLED, button }) => {
  const helpers = {};

  let isClicked = false;
  let state = false;
  let interval;
  let active;

  helpers.deactivate = (LED) => {
    LED.writeSync(0);
    active = false;
    console.log('deactivate:', active);
  };

  helpers.activate = (LED) => {
    LED.writeSync(1);
    active = true;
    console.log('activate:', active);
  };

  helpers.flash = (blinkLED, speed) => {
    if (!interval) {
      interval = setInterval(blinkLED, speed);
    }
  };

  helpers.stopFlash = (LED) => {
    clearInterval(interval);
    helpers.deactivate(LED);
  };

  helpers.runLED = (LED, blinkLED, durationMs = 420000, speedMs = 500) => {
    helpers.flash(blinkLED, speedMs);
    setTimeout(() => {
      helpers.stopFlash(LED);
    }, durationMs);
  };

  helpers.off = (mod) => { mod.writeSync(0); state = false; };
  helpers.on = (mod) => { mod.writeSync(1); state = true; };

  helpers.toggleMod = (mod) => {
    state = !state;
    mod.writeSync(state ? 1 : 0);
  };

  helpers.watchLED = (disarmStatus) => {
    if (
      disarmStatus === true || disarmStatus === 'true'
      || disarmStatus === 1 || disarmStatus === '1'
    ) {
      yellowLED.writeSync(1);
      state = true;
    } else {
      yellowLED.writeSync(0);
      state = false;
    }
  };

  helpers.onClick = (clickEvent) => {
    button.watch((err, value) => {
      if (err) {
        console.log('Error in helpers.onClick: ', err);
      } else {
        if (value === 1) isClicked = true;
        if (value === 0) isClicked = false;

        if (isClicked) {
          setTimeout(() => {
            if (isClicked) {
              clickEvent(); // EMC Wrapped
            }
          }, 1500);
        }
      }
    });

    process.on('SIGINT', () => {
      button.unexport();
      yellowLED.unexport();
    });
  };

  helpers.toggleDisarm = (wasClicked, socketEvent) => {
    helpers.toggleMod(yellowLED);
    if (wasClicked) socketEvent();
  };

  helpers.runPump = (test) => {
    const pump = (test ? yellowLED : relay);
    helpers.on(pump);
    setTimeout(() => helpers.off(pump), 7000);
  };

  return helpers;
};

module.exports = helpersClosure;
