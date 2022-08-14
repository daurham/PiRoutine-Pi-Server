const helpersClosure = ({ relay, yellowLED, button }) => {
  const helpers = {};

  let isClicked = false;
  // let isDisarmed;
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

  helpers.runPump = (test) => {
    const pump = (test ? yellowLED : relay);
    helpers.on(pump);
    console.log((state ? 'off' : 'on'));
    setTimeout(() => helpers.off(pump), 7000);
    console.log((state ? 'off' : 'on'));
  };

  return helpers;
};

module.exports = helpersClosure;
