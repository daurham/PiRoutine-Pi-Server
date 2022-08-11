// Turns a temporal date obj into a readable time.

const T = require("@js-temporal/polyfill").Temporal.Now;

 function convert(t) {
  t = t || T.plainTimeISO();
  return `${(t.hour === 0 ? 12 : (t.hour > 12 ? t.hour % 12 : t.hour))}:${(t.minute < 10 ? String('0' + t.minute) : t.minute)}:${(t.second < 10 ? String('0' + t.second) : t.second)} ${(t.hour > 11 ? 'PM' : 'AM')}`
};

module.exports = convert;