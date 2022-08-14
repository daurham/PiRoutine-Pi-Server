/** Turns a temporal date obj into a readable time.
 *  */

const T = require('@js-temporal/polyfill').Temporal.Now;

const convert = (time) => {
  const t = time || T.plainTimeISO();
  let resultTime = '';
  const { hour, minute, second } = t;
  // Get hour
  if (hour > 0 && hour < 12) resultTime += hour;
  if (hour === 0) resultTime += 12;
  if (hour > 12) resultTime += hour % 12;
  resultTime += ':';
  // Get min
  if (minute < 10) resultTime += String('0' += minute);
  if (minute > 9) resultTime += String(minute);
  resultTime += ':';
  // Get sec
  if (second < 10) resultTime += String('0' += second);
  if (second > 9) resultTime += String(second);
  resultTime += ':';
  // Get tod
  resultTime += (hour > 11 ? ' PM' : ' AM');
  return resultTime;
};

// return `${(t.hour === 0 ? 12 : (t.hour > 12 ? t.hour % 12 : t.hour))}:
// ${(t.minute < 10 ? String('0' + t.minute) : t.minute)}:
// ${(t.second < 10 ? String('0' + t.second) : t.second)}
// ${(t.hour > 11 ? 'PM' : 'AM')}`

module.exports = {
  convert,
};
