const helpersClosure = ({ relay, yellowLED }) => {
  const helpers = {};

  // const { mod, } = arguments[0]; //Array.prototype.slice.call(arguments, 0);

  let state = false;
  let interval;
  let activeG = false;
  let activeR = false;
  let activeY = false;

  helpers.deactivate = (LED, active) => { LED.writeSync(0); active = false; console.log('deactivate:', active) };
  helpers.activate = (LED, active) => { LED.writeSync(1); active = true; console.log('activate:', active) };
  
  // helpers.blinkG = () => (activeG ? deactivate(greenLED, activeG) : activate(greenLED, activeG));
  // helpers.blinkR = () => (activeR ? deactivate(redLED, activeR) : activate(redLED, activeR));
  helpers.blinkY = () => (activeY ? helpers.deactivate(yellowLED, activeY) : helpers.activate(yellowLED, activeY));
  // helpers.blinkTogG = null; // = (turnOn) => (turnOn ? deactivate(greenLED, activeG) : activate(greenLED, activeG));
  // helpers.blinkTogR = null; // = (turnOn) => (turnOn ? deactivate(redLED, activeR) : activate(redLED, activeR));
  // helpers.blinkTogY = null; // = (turnOn) => (turnOn ? deactivate(yellowLED, activeY) : activate(yellowLED, activeY));
  // helpers.dance = (fns, loop) => { let i = 0; while (i < loop) { fns.forEach(f => console.log(f)); i++ } };

  // helpers.blinkFns = { blinkG, blinkR, blinkY, blinkTogG, blinkTogR, blinkTogY, dance };



  helpers.flash = (blinkLED, speed) => { if (!interval) { interval = setInterval(blinkLED, speed) } };
  helpers.stopFlash = (LED) => { clearInterval(interval); helpers.deactivate(LED) };

  helpers.runLED = (LED, blinkLED, durationMs = 420000, speedMs = 500) => { flash(blinkLED, speedMs); setTimeout(() => { helpers.stopFlash(LED) }, durationMs); };

  helpers.off = (mod) => { mod.writeSync(0); state = false; };

  helpers.on = (mod) => { mod.writeSync(1); state = true; };

  helpers.keepOn = () => activeY ? null : helpers.on(yellowLED);
  helpers.keepOff = () => activeY ? null : helpers.off(yellowLED);

  helpers.runPump = (test = false) => {
    let pump = (test ? redLED : relay);
    on(pump);
    console.log((state ? 'off' : 'on'));
    setTimeout(() => off(pump), 7000);
    console.log((state ? 'off' : 'on'));
    // state = !state;
  };

  return helpers;
};

module.exports = { helpersClosure }