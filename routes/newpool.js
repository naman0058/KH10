var mysql = require('mysql')
require('dotenv').config()

const pool = mysql.createPool({
 
 host : 'localhost',
   user: 'kh10nonvegworld',
    password : 'Kh10nonvegworld123@$',
    database: 'kh10nonvegworld',
    port:'3306' ,
    multipleStatements: true
  })


module.exports = pool;