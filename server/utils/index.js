const adjustInputTime = ({ hour, minute, tod }) => {
  const min = Number(minute);
  let hr = Number(hour);
  if (tod === 'AM' && hr === 12) hr = 0;
  if (tod === 'PM' && hr !== 12) hr += 12;
  return { hour: hr, minute: min, tod };
};

module.exports = { adjustInputTime };
