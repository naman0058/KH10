var express = require('express');
var router = express.Router();
var pool = require('./pool')
var table = 'checkout';




router.post("/", (req, res) => {
    let body = req.body;
    pool.query(`insert into ${table} set ? `, body, (err, result) => {
        if(err) {
            res.json({
                status:500,
                type : 'error',
                description:err
            })
        }
		else {
            res.json({
                status:200,
                type : 'success',
                description:'successfully added'
            })
        }
    });
  });



  router.post('/all',(req,res)=>{
      pool.query(`select * from ${table}`,(err,result)=>{
          if(err) throw err;
          else res.json(result)
      })
  })



  module.exports = router;