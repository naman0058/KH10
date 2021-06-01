
var mysql = require('mysql')
require('dotenv').config()

const pool = mysql.createPool({
 
 host : 'namma-do-user-4199968-0.b.db.ondigitalocean.com',
   user: 'doadmin',
    password : 'uf3tby3uru8la7v3',
    database: 'namma',
    port:'25060' ,
    multipleStatements: true
  })


module.exports = pool;