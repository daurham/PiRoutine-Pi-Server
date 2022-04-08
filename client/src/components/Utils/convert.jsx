// turns a temporal date obj into a readable time.

import { Temporal } from "@js-temporal/polyfill";

export default function convert(t = null) {
  t = t || Temporal.Now.plainTimeISO();
  return `${(t.hour === 0 ? 12 : (t.hour > 12 ? t.hour % 12 : t.hour))}:${(t.minute < 10 ? String('0' + t.minute) : t.minute)}:${(t.second < 10 ? String('0' + t.second) : t.second)} ${(t.hour > 11 ? 'PM' : 'AM')}`
};