const { default: axios } = require("axios");
const CLIENT_URL = 'https://piroutine.com/pi/'
// TODO: Write functions that will update the applications front-end client
// note, if the client isnt running, this wont matter.
// Look into settin gup express listers on the cleints front end so i can update state directly.

const updateClientsStreak = () => axios.post(`${CLIENT_URL}:streak`).catch(console.log('failed updateClientFn: Streak'));

const updateClientsAlarm = () => axios.post(`${CLIENT_URL}:alarm`).catch(console.log('failed updateClientFn: Alarm'));

const updateClientsDefuseStatus = () => axios.post(`${CLIENT_URL}:defuse`).catch(console.log('failed updateClientFn: Defuse'));

module.exports = { updateClientsAlarm, updateClientsStreak, updateClientsDefuseStatus };