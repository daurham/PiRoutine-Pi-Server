const mysql = require('mysql2');
const password = require('../../creds.config.js').password;
const user = require('../../creds.config.js').user;

const connection = mysql.createConnection({
  host: 'localhost',
  user,
  database: 'routinepi',
  password
}, () => console.log('db running...'));

module.exports = connection;