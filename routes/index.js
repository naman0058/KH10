var express = require('express');
var router = express.Router();
const request = require('request');
var pool = require('./pool');
    utf8 = require('utf8');


var sha256 = require('sha-256-js');


var sha256 = require('sha-256-js'),
  utf8 = require('utf8');
 
console.log(
  sha256(
    utf8.encode("í")
  )
);



var sha256 = require('sha-256-js');


// var sha256 = require('sha-256-js'),
//   utf8 = require('utf8');
 
// console.log(
//   sha256(
//     utf8.encode("í")
//   )
// );












// var secretKey = "0ffa4b4850db25a28e732d34e288aa8034a90ff6";
//   var postData = [
//   appId = '104544c31bfc16b6c043727605445401',
//   orderId = 'order00001',
//   orderAmount = '100',
//   orderCurrency = 'INR',
//   orderNote = 'Test',
//   customerName = 'Naman',
//   customerPhone = '9009716140',
//   customerEmail = 'jnaman345@gmail.com',
//   returnUrl = 'http://www.kh10nonvegworld.com',
//   notifyUrl = 'http://www.nongvegworld.com',
//   ]

//   foreach (postData as key => value){
//     $signatureData = key.value;
// }

// var signatureData=[]

// for (i=0;i<postData.length;i++){
//   console.log('dd',postData[i])
//   signatureData.push(postData[i])

// }






// console.log(
//   sha256(
//     utf8.encode(signatureData)
//   )
// );


 // get secret key from your config
//  ksort(postData);
//  let signatureData = "";




//  $signature = hash_hmac('sha256', $signatureData, $secretKey,true);
//  $signature = base64_encode($signature);






/* GET home page. */
router.get('/', function(req, res, next) {
  pool.query(`select * from services`,(err,result)=>{
    if(err) throw err;
    else res.render('index', {result:result });
  })
  
});


router.post('/send-link',(req,res)=>{
  request(`http://mysmsshop.in/V2/http-api.php?apikey=gCuJ0RSBDLC3xKj6&senderid=SAFEDI&number=${req.body.number}&message=Hello ${req.body.name} , Download Our App.&format=json`, { json: true }, (err, result) => {
  if (err) { return console.log(err); }
  res.json({
    msg :'success'
  })
});
})





router.get('/checking',(req,res)=>{
  res.send('gi')
})

router.post('/checking',(req,res)=>{
  let body = req.body;
  if(req.body.txStatus == 'SUCCESS' && req.body.txMsg == 'Transaction Successful'){
    res.json({
      msg : 'success'
    })
  }
  else {
    res.json({
      msg :'fail'
    })
  }
  
})



router.get('/dummy',(req,res)=>{
  res.render('demo')
})


router.get('/privacy-policy',(req,res)=>{
  res.render('privacy')
})


router.get('/terms-and-conditions',(req,res)=>{
  res.render('terms')
})

router.get('/refund-policy',(req,res)=>{
  res.render('refund')
})









let data2 = []


router.post('/get-product-details',(req,res)=>{

     
    let data1 = []
  
    
    pool.query(`select s.* ,
    (select w.booking_id from wishlist w where w.booking_id = s.id and w.usernumber = '${req.body.number}') as wishlistITem
    from services s where s.subcategoryid = '${req.body.subcategoryid}' order by id desc`,(err,result)=>{
        if(err) throw err;
        else {
    //  console.log(result.length)
    
   for( i=0;i<result.length;i++){
       let j = i
       let length = result.length
       let title = result[i].name
       let image = result[i].image
       let status = result[i].status
       let quantity = result[i].quantity
       let price = result[i].price
       let productid = result[i].id
       let id = result[i].id
      //  let userquantity = result[i].userquantity
       let wishlistITem = result[i].wishlistITem

      //  let subcategoryid = result[i].subcategoryid

 console.log('original',productid)

       
       pool.query(`select s.* , 
    (select c.quantity from cart c where c.booking_id = s.productid and c.usernumber = '${req.body.number}' and weight = s.quantity) as userquantity
        from menu_manage s where s.productid = '${productid}' order by id desc `,(err,response)=>{
           if(err) throw err;
           else {
  


// console.log(j)
   data2.push({Title:title,image,status,quantity,price,id,wishlistITem,data:response})
 
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







module.exports = router;
