var express = require('express');
var router = express.Router();
var pool = require('./pool')
var table = 'users';


var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = mm + '/' + dd + '/' + yyyy;





router.post('/signup',(req,res)=>{
    let body = req.body
    let random_number = Math.random().toString(36).substring(7);
    body['unique_code']= random_number
    body['todayDate'] = today   
    pool.query(`select * from ${table} where number  = '${req.body.number}'`,(err,result)=>{
        if(err) {
            res.json({
                status:500,
                type : 'error',
                description:err
            })
        }
        else if(result[0]) {
          res.json({
              status : 100,
              type:'failed',
              description : 'already registered'
          })
        }
        else{
         pool.query(`insert into ${table} set ?`,body,(err,result)=>{
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
                    description:'successfully registered'
                })
             }
         })
        }
    })
})



router.post('/login',(req,res)=>{
    pool.query(`select * from ${users} where number = '${req.body.number}'`,(err,result)=>{
        if(err) {
            res.json({
                status:500,
                type : 'error',
                description:err
            })
        }
        else if(result[0]){
            res.json({
                status:200,
                type : 'success',
                description:'send otp'
            })

        }
        else{
            res.json({
                status:100,
                type : 'error',
                description:'user not registered'
            })
        }
    })
})




router.post('/show',(req,res)=>{
    pool.query(`select * from ${table} order by id desc`,(err,result)=>{
        if(err) throw err;
        else res.json(result)
    })
})




router.post('/add-cash',(req,res)=>{
    let body = req.body
    let extra = (req.body.amount)*10;
    let total_amount = (+req.body.price) + (+extra)
    pool.query(`update ${table} set wallet = wallet + '${total_amount}' where number = '${req.body.number}'`,(err,result)=>{
        if(err) {
            res.json({
                status:500,
                type : 'error',
                description:err
            })

        }
        else{
     pool.query(`insert into transcations set ?`,body,(err,result)=>{
         if(err) {
            res.json({
                status:500,
                type : 'error',
                description:err
            })


         }
         else{
            res.json({
                status:200,
                type : 'success',
                description:'amount deposited'
            })


         }
     })       

        }
    })
    
})




router.post('/profile',(req,res)=>{
    pool.query(`select * from ${table} where number = '${req.body.number}'`,(err,result)=>{
        if(err) throw err;
        else res.json(result)
    })
})


router.post('/refer-and-earn',(req,res)=>{
  pool.query(`select unique_code from ${table} where number = '${req.body.number}'`,(err,result)=>{
      if(err) throw err;
      else res.json(result)
  })

})


router.post('/myrefferal',(req,res)=>{
    var query = `select * from ${table} where refferal_code = '${req.body.unique_code}';`
    var query1 = `select count(id) from ${table} where refferal_code = '${req.body.unique_code}';`
    pool.query(query+query1,(err,result)=>{
        if(err) throw err;
        else res.json(result)
    })
})






module.exports = router