var express = require('express');
var router = express.Router();
var pool = require('./pool')
var table = 'cart';


var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = mm + '/' + dd + '/' + yyyy;



router.post('/',(req,res)=>{
    let body = req.body
    console.log(req.body)
    pool.query(`select * from services where id = "${req.body.booking_id}" `,(err,result)=>{
      if(err) {
        res.json({
            status:500,
            type : 'error',
            description:err
        })
      }
      else {
        // body['categoryid'] = result[0].categoryid
        // body['subcategoryid'] = result[0].subcategoryid
        body['price'] = result[0].net_amount
        body['oneprice'] =  result[0].net_amount
           body['quantity'] = '1'
        body['price'] = req.body.price
        body['todayDate'] = today
        var qua = '1'
  pool.query(`select * from ${table} where usernumber = '${req.body.usernumber}'`,(err,result)=>{
  if(err){
    res.json({
        status:500,
        type : 'error',
        description:err
    })
  }
  else if(result[0]) {
    if(req.body.partner_number==result[0].partner_number){
      if(req.body.booking_id ==result[0].booking_id){
  pool.query(`update ${table} set quantity = quantity+${qua} , price = price+${req.body.price} where booking_id = '${req.body.booking_id}' and usernumber = '${req.body.usernumber}'`,(err,result)=>{
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
        description : 'updated sucessfully'
    })
  }
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
        else{
          res.json({
            status:200,
            type : 'success',
            description : 'updated sucessfully'
          })
        }
      })
    }
    }
    else{
      res.json({
        msg : 'Can not book two different partner services simultaneously. Replace Cart ?',
        description : 'failed'
      })
    }
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
            description : 'updated sucessfully'
        })
      }
    })
  }
  
  })
  }
  })
 
  
  })



  
  router.post('/cart/replace',(req,res)=>{
    let body = req.body
    console.log(req.body)
    body['todayDate'] = today
    pool.query(`select * from services where id = "${req.body.booking_id}" `,(err,result)=>{
      if(err) {
        res.json({
            status:500,
            type : 'error',
            description:err
        })
      }
      else {
        // body['categoryid'] = result[0].categoryid
        // body['subcategoryid'] = result[0].subcategoryid
        body['price'] = result[0].net_amount
        body['oneprice'] =  result[0].net_amount
           body['quantity'] = '1'
        body['price'] = req.body.price
  
    pool.query(`delete from ${table} where usernumber = '${req.body.usernumber}'`,(err,result)=>{
      if(err) {
        res.json({
            status:500,
            type : 'error',
            description:err
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
                description : 'updated sucessfully'
            })
          }
        })
      }
     
    })
  }
  })
  
  })
  
  
  
  router.post('/cart/all',(req,res)=>{
  pool.query(`select usernumber from ${table} where usernumber = '${req.body.usernumber}'`,(err,result)=>{
      if(err) throw err;
      else res.json(result)
    })
  
  
  })



  router.post("/mycart", (req, res) => {
 
    var query = `select c.*,(select s.name from services s where s.id = c.booking_id) as servicename
    ,(select s.image from services s where s.id = c.booking_id) as productlogo
    from cart c where c.usernumber = '${req.body.usernumber}';`
    var query1 = `select count(id) as counter from cart where usernumber = '${req.body.usernumber}';`
    var query2 = `select sum(price) as total_ammount from ${table}  where usernumber = '${req.body.usernumber}'; `

      pool.query(query+query1+query2, (err, result) => {
      if (err) throw err;
      else if (result[0][0]) {
        req.body.mobilecounter = result[1][0].counter;
        console.log("MobileCounter", req.body.mobilecounter);
        res.json(result);
      } else
        res.json({
          msg: "empty cart",
        });
    });

});
  
  
  // router.post('/mycart',(req,res)=>{
    
  //     var query = `select c.*,(select s.name from services s where s.id = c.booking_id) as servicename
  //     from ${table} c where c.usernumber = '${req.body.usernumber}';`
  //     var query1 = `select count(id) as counter from ${table} where usernumber = '${req.body.usernumber}';`
  //     var query2 = `select sum(price) as total_ammount from ${table}  where usernumber = '${req.body.usernumber}'; `
  //        pool.query(query+query1+query2,(err,result)=>{
  //       if(err) {
  //           res.json({
  //               status:500,
  //               type : 'error',
  //               description:err
  //           })
  //       }
  //       else if(result[0][0]) {
  //              req.body.mobilecounter = result[1][0].counter
  //              console.log("MobileCounter",req.body.mobilecounter)
  //              res.json({
  //               status:200,
  //               type : 'success',
  //               description:result
  //           })
          
  //       }
  //       else{
  //           res.json({
  //               status:100,
  //               type : 'failed',
  //               description:'cart empty'
  //           })
  //       }
  //     })
    
  // })
  
  
  router.post('/cartupdate',(req,res)=>{
    
    pool.query(`select id,price,oneprice,quantity from ${table} where id = "${req.body.id}"`,(err,result)=>{
      if(err) {
        res.json({
            status:500,
            type : 'error',
            description:err
        })
      }
      else{
        console.log(result[0])
        pool.query(`update ${table} set price = price + oneprice , quantity = quantity+1  where id = "${req.body.id}"`,(err,result)=>{
                  if(err){
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
                        description:'updated successfully'
                    })
                  }
            
        })
      }
    })

  })
  
  router.post('/cartdelete',(req,res)=>{
   
    pool.query(`select id,price,quantity from ${table} where id = "${req.body.id}"`,(err,result)=>{
      if(err) {
        res.json({
            status:500,
            type : 'error',
            description:err
        })
      }
      else if(result[0].quantity > 1 ){
        console.log(result[0])
        pool.query(`update ${table} set price = price - (price/quantity) , quantity = quantity-1  where id = "${req.body.id}"`,(err,result)=>{
            if(err){
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
                    description:'deleted successfully'
                })
              }
        
           
        })
      }
  
      else{
        pool.query(`delete from ${table} where id = "${req.body.id}"`,(err,result)=>{
            if(err){
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
                    description:'deleted successfully'
                })
              }
      
        })
      }
  
    })

  })
  
  




  

router.post("/cart-handler", (req, res) => {
  let body = req.body
  console.log(req.body)
  if (req.body.quantity == "0" || req.body.quantity == 0) {
  pool.query(`delete from cart where booking_id = '${req.body.booking_id}' and  usernumber = '${req.body.usernumber}' `,(err,result)=>{
      if (err) throw err;
      else {
        res.json({
          msg: "updated sucessfully",
        });
      }
  })
  }
  else {
      pool.query(`select oneprice from cart where booking_id = '${req.body.booking_id}' and  categoryid = '${req.body.categoryid}' and usernumber = '${req.body.usernumber}'`,(err,result)=>{
          if (err) throw err;
          else if (result[0]) {
             // res.json(result[0])
              pool.query(`update cart set quantity = ${req.body.quantity} , price = ${result[0].oneprice}*${req.body.quantity}  where booking_id = '${req.body.booking_id}' and categoryid = '${req.body.categoryid}' and usernumber = '${req.body.usernumber}'`,(err,result)=>{
                  if (err) throw err;
                  else {
                      res.json({
                        msg: "updated sucessfully",
                      });
                    }

              })
          }
          else {
            body["price"] = (req.body.price)*(req.body.quantity)
               pool.query(`insert into cart set ?`, body, (err, result) => {
               if (err) throw err;
               else {
                 res.json({
                   msg: "updated sucessfully",
                 });
               }
             });

          }

      })
  }

})




  module.exports = router;
       

