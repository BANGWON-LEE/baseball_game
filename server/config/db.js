var mysql = require('mysql');
// const db = mysql.createPool({
//     // host : '127.0.0.1',
//     // port : 3306,
//     // user : 'root',
//     // password : 'Bizmyhand1!',
//     // database : 'baseball_game'
//     host: 'http://localhost:3306',
//     user: 'root',
//     password: 'Bizmyhand1!',
//     database: 'baseball_game',
//     connectionLimit: 10
// });


const db = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'Bizmyhand1!',
    database: 'baseball_game'
  });
  


module.exports = db;
