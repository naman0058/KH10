const { json } = require('express');
var express = require('express');
var router = express.Router();
var pool = require('./pool')
var table = 'booking';
const request = require('request');
const fetch = require('node-fetch');
var crypto    = require('crypto');
const { resolveSoa } = require('dns');


var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = yyyy + '-' + mm + '-' + dd;


//var todayDate = newdate.toLocaleDateString()





router.post('/request',function(req, res, next){

	var postData = {
        "appId" : '104544c31bfc16b6c043727605445401',
		"orderId" : req.body.orderId,
		"orderAmount" : req.body.orderAmount,
		"orderCurrency" : 'INR',
		"orderNote" : req.body.orderNote,
		'customerName' : req.body.customerName,
		"customerEmail" : req.body.customerEmail,
		"customerPhone" : req.body.customerPhone,
		"returnUrl" : 'http://kh10nonvegworld.com/checking',
		"notifyUrl" :'http://kh10nonvegworld.com/checking'
	},
	mode = "PROD",
	secretKey = "0ffa4b4850db25a28e732d34e288aa8034a90ff6",
	sortedkeys = Object.keys(postData),
	url="",
	signatureData = "";
	sortedkeys.sort();
	for (var i = 0; i < sortedkeys.length; i++) {
		k = sortedkeys[i];
		signatureData += k + postData[k];
	}
	var signature = crypto.createHmac('sha256',secretKey).update(signatureData).digest('base64');
	postData['signature'] = signature;
	if (mode == "PROD") {
	  url = "https://www.cashfree.com/checkout/post/submit";
	} else {
	  url = "https://test.cashfree.com/billpay/checkout/post/submit";
	}


    res.json(postData)

	//res.render('request',{postData : JSON.stringify(postData),url : url});
});


router.get('/request',(req,res)=>{
   // res.json(req.query.postData)
   let query = JSON.parse(req.query.postData)
    res.render('request',{postData:query})
})

router.post('/response',function(req, res, next){

	var postData = {
	  "orderId" : req.body.orderId,
	  "orderAmount" : req.body.orderAmount,
	  "referenceId" : req.body.referenceId,
	  "txStatus" : req.body.txStatus,
	  "paymentMode" : req.body.paymentMode,
	  "txMsg" : req.body.txMsg,
	  "txTime" : req.body.txTime
	 },
	secretKey = "0ffa4b4850db25a28e732d34e288aa8034a90ff6",

	signatureData = "";
	for (var key in postData) {
		signatureData +=  postData[key];
	}
	var computedsignature = crypto.createHmac('sha256',secretKey).update(signatureData).digest('base64');
	postData['signature'] = req.body.signature;
	postData['computedsignature'] = computedsignature;
	res.render('response',{postData : JSON.stringify(postData)});
});











router.get('/',(req,res)=>{
    if(req.session.adminid){
        res.render('orders')
    }
    else {
        res.render('admin_login',{msg:'Please Login First'})
    }
  // res.render('category')
    
})


router.get('/history',(req,res)=>{
    if(req.session.adminid){
        res.render('history')
    }
    else {
        res.render('admin_login',{msg:'Please Login First'})
    }
  // res.render('category')
    
})


router.get('/transactions',(req,res)=>{
    if(req.session.adminid){
        res.render('order_transcations')
    }
    else {
        res.render('admin_login',{msg:'Please Login First'})
    }
  // res.render('category')
    
})


router.get('/order-transcations-data',(req,res)=>{
    pool.query(`select * from transcations where type = 'order' order by id desc`,(err,result)=>{
        if(err) throw err;
        else res.json(result)
    })
})

//transcations


router.get('/running-orders',(req,res)=>{
    pool.query(`select b.* ,
    (select v.name from vendors v where v.number = b.partner_number) as vendorname
    from ${table} b where b.status != 'completed' `,(err,result)=>{
        if(err) throw err;
        else res.json(result)
    })
})



router.get('/complete-orders',(req,res)=>{
    pool.query(`select b.* ,
    (select v.name from vendors v where v.number = b.partner_number) as vendorname
    from ${table} b where b.status = 'completed' `,(err,result)=>{
        if(err) throw err;
        else res.json(result)
    })
})


router.post('/',(req,res)=>{
    let body = req.body
    body['status']  = 'pending'
    body['date'] = today


pool.query(`select wallet from users where number = '${req.body.number}'`,(err,result)=>{
    if(err) throw err;
    else {
           if((+result[0].wallet) > (+req.body.amount)) {

            pool.query(`update users set wallet = wallet - '${req.body.amount}' where number = '${req.body.number}'`,(err,result)=>{
                if(err) throw err;
                else {

                 
                }
            })
           }
           else {
               res.json({
                   status : 500,
                   type:'error',
                   description:'low balance'
               })
           }
    }
})

})








router.post('/order-now',(req,res)=>{
    let body = req.body;
console.log('body',req.body)
    let cartData = req.body


  //  console.log('CardData',cartData)

     body['status'] = 'pending'
      

    var today = new Date();
var dd = today.getDate();

var mm = today.getMonth()+1; 
var yyyy = today.getFullYear();
if(dd<10) 
{
    dd='0'+dd;
} 

if(mm<10) 
{
    mm='0'+mm;
} 
today = yyyy+'-'+mm+'-'+dd;


body['date'] = today



    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for ( var i = 0; i < 12; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
   orderid = result;


   pool.query(`select wallet from users where number = '${req.body.usernumber}'`,(err,result)=>{
    if(err) throw err;
    else {
           if((+result[0].wallet) > (+req.body.amount)) {

            pool.query(`update users set wallet = wallet - '${req.body.amount}' where number = '${req.body.usernumber}'`,(err,result)=>{
                if(err) throw err;
                else {
                    pool.query(`select * from cart where usernumber = '${req.body.usernumber}'`,(err,result)=>{
                        if(err) throw err;
                        else {
                 
                        let data = result
                 
                        for(i=0;i<result.length;i++){
                         data[i].name = req.body.name
                         data[i].date = today
                         data[i].orderid = orderid
                         data[i].status = 'pending'
                         data[i].number = req.body.number
                         data[i].usernumber = req.body.usernumber
                         data[i].payment_mode = 'cash'
                         data[i].address = req.body.address
                         data[i].id = null
                         data[i].delivery_date = req.body.delivery_date
                         data[i].delivery_time = req.body.delivery_time
                 
                 
                        }
                 
                 
                 
                 for(i=0;i<data.length;i++) {
                    pool.query(`insert into booking set ?`,data[i],(err,result)=>{
                            if(err) throw err;
                            else {
                                console.log(result)
                 
                 
                            }
                       })
                 }
                 
                 
                     
                 
                 
                 pool.query(`delete from cart where usernumber = '${req.body.usernumber}'`,(err,result)=>{
                     if(err) throw err;
                     else {
                         res.json({
                             msg : 'success'
                         })
                     }
                 })
                 
                 
                        }
                    })
                 
                }
            })
           }
           else {
               res.json({
                   status : 500,
                   type:'error',
                   description:'low balance'
               })
           }
    }
})


  

   
})


router.post('/cash',(req,res)=>{
    let body = req.body
    body['status']  = 'pending'
    body['date'] = today


            pool.query(`select id from ${table} where number = '${req.body.number}'`,(err,result)=>{
                if(err) {
                    res.json({
                        status:500,
                        type : 'error',
                        description:err
                    })
                }
                else if(result[0]){
        
            

                    pool.query(`insert into ${table} set ?`,body,(err,result)=>{
                        if(err) {
                            res.json({
                                status:500,
                                type : 'error',
                                description:err
                            })
                        }
                        else {
                            request(`http://mysmsshop.in/V2/http-api.php?apikey=gCuJ0RSBDLC3xKj6&senderid=SAFEDI&number=${req.body.number}&message=Hello ${req.body.name} , your order for ${req.body.booking_id} has been placed successfully. &format=json`, { json: true }, (err, result) => {
                                                    if (err) { return console.log(err); }
                                                    else {
        
                                                        request(`http://mysmsshop.in/V2/http-api.php?apikey=gCuJ0RSBDLC3xKj6&senderid=SAFEDI&number=${req.body.number}&message=Hello ${req.body.name} , your order for ${req.body.booking_id} has been placed successfully. &format=json`, { json: true }, (err, result) => {
                                                            if (err) { return console.log(err); }
                                                            else {
                                                                pool.query(`delete from cart where usernumber = '${req.body.number}'`,(err,result)=>{
                                                                    if(err) throw err;
                                                                    else {
                                                                        res.json({
                                                                            status:200,
                                                                            type:'success',
                                                                            description:'booking success'
                                                                        })   
                                                                    }
                                                                })
                                
                                                            }  
                                                        
                                                    })
                                                       
                                            }
                                                  });
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
                    else {
                     pool.query(`select refferal_code from users where number = '${req.body.number}'`,(err,result)=>{
                         if(err){
                            res.json({
                                status:500,
                                type : 'error',
                                description:err
                            })
                         }
                         else {
                             pool.query(`select number from users where unique_code = '${result[0].refferal_code}'`,(err,result)=>{
                                 if(err) {
                                    res.json({
                                        status:500,
                                        type : 'error',
                                        description:err
                                    })
                                 }
                                 else {
                                     pool.query(`update users set wallet = wallet+100 where number = '${result[0].number}'`,(err,result)=>{
                                         if(err) throw err;
                                         else {
                                            request(`http://mysmsshop.in/V2/http-api.php?apikey=gCuJ0RSBDLC3xKj6&senderid=SAFEDI&number=${req.body.number}&message=Hello ${req.body.name} , your order for ${req.body.booking_id} has been placed successfully. &format=json`, { json: true }, (err, result) => {
                                                if (err) { return console.log(err); }
                                                else {
                                                    request(`http://mysmsshop.in/V2/http-api.php?apikey=gCuJ0RSBDLC3xKj6&senderid=SAFEDI&number=${req.body.number}&message=Hello ${req.body.name} , your order for ${req.body.booking_id} has been placed successfully. &format=json`, { json: true }, (err, result) => {
                                                        if (err) { return console.log(err); }
                                                        else {
                                                            pool.query(`delete from cart where usernumber = '${req.body.number}'`,(err,result)=>{
                                                                if(err) throw err;
                                                                else {
                                                                    res.json({
                                                                        status:200,
                                                                        type:'success',
                                                                        description:'booking success'
                                                                    })   
                                                                }
                                                            })
                            
                                                        }  
                                                    
                                                })
                                                   
                                        }
                                              });
                                         }
                                     })
                                 }
                             })
                         }
                     })   
                      
                    }
                })
               
                    
        
                 
        
                }
            })

        


})


router.post('/user',(req,res)=>{
   pool.query(`select * from ${table} where number = '${req.body.number}' order by id desc`,(err,result)=>{
       if(err) throw err;
       else res.json(result)
   })
})


router.post('/vendors',(req,res)=>{
    pool.query(`select * from ${table} where partner_number = '${req.body.number}' and status = 'pending' order by id desc`,(err,result)=>{
        if(err) throw err;
        else res.json(result)
    })
 })


 router.post('/user-history',(req,res)=>{
     pool.query(`select * from ${table} where number = '${req.body.number}' and status = 'completed' order by id desc`,(err,result)=>{
         if(err) throw err;
         else {
            res.json(result)
         }
     })
 })



 router.post('/vendor-history',(req,res)=>{
    pool.query(`select * from ${table} where partner_number = '${req.body.number}' and status = 'delievered' order by id desc`,(err,result)=>{
        if(err) throw err;
        else {
           res.json(result)
        }
    })
})





router.post('/razorpay',(req,res)=>{

    const url = `https://rzp_live_2KlcXieUGyQ8k6:9CukFlVqEBgQ1l7LB03DXBPk@api.razorpay.com/v1/orders/`;
    const data = {
        amount:req.body.amount*100,  // amount in the smallest currency unit
      //amount:100,
      currency: 'INR',
        payment_capture: true
    }
    const options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }
    fetch(url, options)
        .then(res => res.json())
        .then(
            resu => res.send(resu)
           );
  
 })





 
router.post('/booking_successfull',(req,res)=>{
  let body = req.body
  body['status']  = 'pending'
  body['date'] = today
  pool.query(`insert into ${table} set ?`,body,(err,result)=>{
      if(err) res,json(err)
      else {
        request(`http://mysmsshop.in/V2/http-api.php?apikey=gCuJ0RSBDLC3xKj6&senderid=SAFEDI&number=${req.body.number}&message=Hello ${req.body.name} ,Hello ${req.body.name} , your order for ${req.body.bookingid} has been placed successfully. &format=json`, { json: true }, (err, result) => {
            if (err) { return console.log(err); }
            else {
                res.json({
                          msg : 'success'
                      })
    }
          });
      }
    
  })
})




module.exports = router;