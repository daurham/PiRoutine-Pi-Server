// turns a temporal date obj into a readable time.
export default function(t = null) {
  t = t || now;
  return `${(t.hour > 12 ? t.hour % 12 : t.hour)}:${(t.minute < 10 ? String('0' + t.minute) : t.minute)}:${(t.second < 10 ? String('0' + t.second) : t.second)} ${(t.hour > 11 ? 'PM' : 'AM')}`
};