const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'daurham',
  database: 'routinepi',
  password: 'Kippy1212'
}, () => console.log('db running...'));

module.exports = connection;