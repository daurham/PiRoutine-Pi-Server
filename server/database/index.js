const mysql = require('mysql2');
const env = require('dotenv').config().parsed;

const {
  PASSWORD,
  USER,
  DATABASE,
  HOST,
} = env;

const connection = mysql.createConnection({
  HOST,
  user: 'root',
  DATABASE,
  PASSWORD,
}, () => console.log('db running...'));

module.exports = connection;
