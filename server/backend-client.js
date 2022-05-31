const { default: axios } = require("axios");
const CLIENT_URL = 'https://piroutine.com/pi/'
// TODO: Write functions that will update the applications front-end client
// note, if the client isnt running, this wont matter.

const updateClientsStreak = () => axios.post(`${CLIENT_URL}:streak`).catch(console.log);

const updateClientsAlarm = () => axios.post(`${CLIENT_URL}:alarm`).catch(console.log);

const updateClientsDefuseStatus = () => axios.post(`${CLIENT_URL}:defuse`).catch(console.log);

module.exports = { updateClientsAlarm, updateClientsStreak, updateClientsDefuseStatus };