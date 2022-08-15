const mysql = require('mysql2');
const {
  password,
  user,
  database,
  host,
} = require('dotenv').config().parsed;

const connection = mysql.createConnection({
  host,
  user,
  database,
  password,
}, () => console.log('db running...'));

module.exports = connection;
