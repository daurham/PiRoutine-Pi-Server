/**
 * This file consists of utility functions for dealing
 *  with controller data.
 */

const adjustInputTime = ({ hour, minute, tod }) => {
  const min = Number(minute);
  let hr = Number(hour);
  if (tod === 'AM' && hr === 12) hr = 0;
  if (tod === 'PM' && hr !== 12) hr += 12;
  return [hr, min, tod];
};

const setQuery = (table, data, method) => {
  if (method === 'GET') {
    if (table === 'users') return `SELECT * FROM ${table} WHERE username = 'daurham'`;
    return `SELECT * FROM ${table}`;
  }
  if (method === 'PATCH') {
    if (table === 'alarmtime') return `UPDATE ${table} SET hour = ?, minute = ?, tod = ?`;
    if (table === 'isdisarmed') return `UPDATE ${table} SET disarmedstatus=?`;
    if (table === 'streakcount') return `UPDATE ${table} SET maxstreak = CASE WHEN ? > maxstreak THEN ? ELSE maxstreak END, streak = ?`;
    if (table === 'soakedcount') return `UPDATE ${table} SET soaked=?`;
    if (table === 'skippedcount' && typeof data === 'number') return `UPDATE ${table} SET skipped=?`;
    if (table === 'skippedcount' && typeof data === 'string') return `UPDATE ${table} SET skipdate=?`;
  }
  return undefined;
};

const setData = (table, data) => {
  // console.log('Setting data: ', data);
  if (table === 'alarmtime') return [...adjustInputTime(data)];
  if (table === 'isdisarmed') return [data];
  if (table === 'streakcount') return [data, data, data];
  if (table === 'soakedcount') return [data];
  if (table === 'skippedcount') return [data];
  return undefined;
};

module.exports = {
  setData,
  setQuery,
};
