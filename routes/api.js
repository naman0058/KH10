var express = require("express");
var router = express.Router();
var upload = require("./multer");
var pool = require("./pool");
var table = "category";
const fs = require("fs");

const fetch = require("node-fetch");


router.post("/payment-initiate", (req, res) => {
  const url = `https://rzp_live_v8MtbgfDg2yTk1:95607TlOfi8LnbKoxWPcFMHp@api.razorpay.com/v1/orders/`;
  const data = {
    amount: req.body.amount * 100, // amount in the smallest currency unit
    //amount:100,
    currency: "INR",
    payment_capture: true,
  };
  console.log("data", data);
  const options = {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  };
  fetch(url, options)
    .then((res) => res.json())
    .then((resu) => res.send(resu));
});

router.get("/demo", (req, res) => {
  res.render("dem");
});

router.get("/demo1", (req, res) => {
  console.log(req.query);
  res.send(req.query);
});

router.post("/razorpay-response", (req, res) => {
  let body = req.body;
  console.log("response recieve", body);

  if (body.razorpay_signature) {
    res.redirect("/api/success_razorpay");
  } else {
    res.redirect("/api/failed_payment");
  }
});

router.get("/success_razorpay", (req, res) => {
  res.json({
    msg: "success",
  });
});

router.get("/failed_payment", (req, res) => {
  res.json({
    msg: "failed",
  });
});

router.post("/failed_payment", (req, res) => {
  res.json({
    msg: "failed",
  });
});

router.post("/get-shopkeeper-details", (req, res) => {
  pool.query(
    `select id , name from vendors where id = '${req.body.id}'`,
    (err, result) => {
      if (err) throw err;
      else res.json(result);
    }
  );
});

router.post("/scan-payment-success", (req, res) => {
  let body = req.body;
  // body['status']  = 'pending'
  // body['date'] = today

  pool.query(
    `select wallet from users where number = '${req.body.number}'`,
    (err, result) => {
      if (err) throw err;
      else {
        if (+result[0].wallet > +req.body.amount) {
          pool.query(
            `update users set wallet = wallet - '${req.body.amount}' where number = '${req.body.number}'`,
            (err, result) => {
              if (err) throw err;
              else {
                pool.query(
                  `insert into scan_transcations set ?`,
                  body,
                  (err, result) => {
                    if (err) {
                      res.json({
                        status: 500,
                        type: "error",
                        description: err,
                      });
                    } else {
                      pool.query(
                        `update vendors set wallet = wallet + ${req.body.amount} where id = '${req.body.scanid}'`,
                        (err, result) => {
                          if (err) throw err;
                          else {
                            res.json({
                              status: 200,
                              type: "success",
                              description: "booking success",
                            });
                          }
                        }
                      );
                    }
                  }
                );
              }
            }
          );
        } else {
          res.json({
            status: 500,
            type: "error",
            description: "low balance",
          });
        }
      }
    }
  );
});

// get-payment-details-by-scan

router.post("/get-payment-details-by-scan", (req, res) => {
  pool.query(
    `select id from vendors where number = '${req.body.number}'`,
    (err, result) => {
      if (err) throw err;
      else {
        pool.query(
          `select * from scan_transcations where scanid = '${result[0].id}' order by id desc`,
          (err, result) => {
            if (err) throw err;
            else res.json(result);
          }
        );
      }
    }
  );
});




let data2 = []


router.get('/index',(req,res)=>{

     
    let data1 = []
  
    
    pool.query(`select * from category`,(err,result)=>{
        if(err) throw err;
        else {
    //  console.log(result.length)
    
   for( i=0;i<result.length;i++){
       let j = i
       let length = result.length
       let title = result[i].name
       let image = result[i].image
       let categoryid = result[i].id
      //  let subcategoryid = result[i].subcategoryid

 console.log('original',categoryid)

       
       pool.query(`select * from subcategory where categoryid = '${categoryid}' `,(err,response)=>{
           if(err) throw err;
           else {
  


// console.log(j)
   data2.push({Title:title,image,data:response})
 
    // console.log('dfgfdfffff',data2)
    // res.json(data2)



           
           }

        //    console.log('fgy',response[0])
           


       })
     
   }
//    console.log('finaltime',data2)
   res.json(data2)
   data2 = []

        }
    })

})





router.get('/time',(req,res)=>{
  pool.query(`select * from time where date>= CURDATE()`,(err,result)=>{
      if(err) throw err;
      else res.json(result)
  })
})





router.get('/get-address',(req,res)=>{
  pool.query(`select * from address where usernumber = '${req.query.usernumber}'`,(err,result)=>{
      if(err) throw err;
      else res.json(result)
  })
})



router.post('/save-address',(req,res)=>{
  let body = req.body;
  console.log('body h',req.body)
  pool.query(`insert into address set ?`,body,(err,result)=>{
      if(err) throw err;
      else res.json({
          msg : 'success'
      })
  })
})




router.post('/save-wishlist',(req,res)=>{
  let body = req.body;
  console.log('body h',req.body)

pool.query(`select * from wishlist where usernumber = '${req.body.usernumber}' and booking_id = '${req.body.booking_id}'`,(err,result)=>{
  if(err) throw err;
  else if(result[0]) {
    pool.query(`delete from wishlist where usernumber = '${req.body.usernumber}' and booking_id = '${req.body.booking_id}'`,(err,result)=>{
      if(err) throw err;
      else  res.json({
        msg : 'success'
    })
    })
  }
  else {
    pool.query(`insert into wishlist set ?`,body,(err,result)=>{
      if(err) throw err;
      else res.json({
          msg : 'success'
      })
  })
  }
})

 
})




let wishlistdata = []



router.post('/mywishlist',(req,res)=>{

     
  let data1 = []

  
  pool.query(`select w.*, 
  (select s.name from services s where s.id = w.booking_id) as productname,
  (select s.image from services s where s.id = w.booking_id) as productimage,
  (select s.status from services s where s.id = w.booking_id) as productstatus,
  (select s.quantity from services s where s.id = w.booking_id) as productquantity,
  (select s.price from services s where s.id = w.booking_id) as productprice
  
  from wishlist w where w.usernumber = '${req.body.usernumber}'`,(err,result)=>{
      if(err) throw err;
      else {
  //  console.log(result.length)
  
 for( i=0;i<result.length;i++){
     let j = i
     let length = result.length
     let title = result[i].productname
     let image = result[i].productimage
     let status = result[i].productstatus
     let quantity = result[i].productquantity
     let price = result[i].productprice
     let productid = result[i].booking_id
     let id = result[i].booking_id
    //  let userquantity = result[i].userquantity
     let wishlistITem = result[i].booking_id

    //  let subcategoryid = result[i].subcategoryid

console.log('original',productid)

     
     pool.query(`select s.* , 
  (select c.quantity from cart c where c.booking_id = s.productid and c.usernumber = '${req.body.usernumber}' and weight = s.quantity) as userquantity
      from menu_manage s where s.productid = '${productid}' `,(err,response)=>{
         if(err) throw err;
         else {



// console.log(j)
wishlistdata.push({Title:title,image,status,quantity,price,id,wishlistITem,data:response})

  // console.log('dfgfdfffff',data2)
  // res.json(data2)



         
         }

      //    console.log('fgy',response[0])
         


     })
   
 }
//    console.log('finaltime',data2)
 res.json(wishlistdata)
 wishlistdata = []

      }
  })

})



router.post('/total-amount',(req,res)=>{
  pool.query(`select sum(price) as total_amount from cart where usernumber = '${req.body.number}'`,(err,result)=>{
        if(err) throw err;
        else res.json(result)
  })
})


module.exports = router;
