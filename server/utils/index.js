const adjustInputTime = ({ hour, minute, tod }) => {
  const min = Number(minute);
  let hr = Number(hour);
  if (tod === 'AM' && hr === 12) hr = 0;
  if (tod === 'PM' && hr !== 12) hr += 12;
  return { hour: hr, minute: min, tod };
};

const adjustInputTime2 = ([hour, minute, tod]) => {
  const min = Number(minute);
  let hr = Number(hour);
  if (tod === 'AM' && hr === 12) hr = 0;
  if (tod === 'PM' && hr !== 12) hr += 12;
  return [hr, min, tod];
};

module.exports = {
  adjustInputTime,
  adjustInputTime2,
};
