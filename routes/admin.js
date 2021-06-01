var express = require('express');

var router = express.Router();
var pool = require('./pool')
var table = 'admin';
const request = require('request');
const auth = 'bearer 8170b1fc-302d-4f5d-b6a8-72fb6dbdb804'

var mapsdk = require('mapmyindia-sdk-nodejs');
//l9fksssn2m6snu4dif9d55z7fpwed1kx

// mapsdk.geoCodeGivenAddressString('l9fksssn2m6snu4dif9d55z7fpwed1kx','68, okhla phase 3, delhi').then(function(res)
// {
//     console.log(JSON.stringify(res));
// }).catch(function(ex){
//     console.log('came in catch');
//     console.log('ex');
// }); 



// mapsdk.reverseGeoCodeGivenLatiLongi('l9fksssn2m6snu4dif9d55z7fpwed1kx','25.77','77.989').then(function(res)
// {
//     console.log(res)
// }).catch(function(ex){
//     console.log('came in catch');
//     console.log(ex)
// });



router.post('/get-all',(req,res)=>{
    var query = `SELECT *, SQRT(
        POW(69.1 * (latitude - '${req.body.latitude}'), 2) +
        POW(69.1 * (longitude - '${req.body.longitude}') * COS(latitude / 57.3), 2)) AS distance
    FROM vendors  HAVING distance < 25 ORDER BY distance;`
    var query1 = `select * from banner_image;`

	pool.query(query+query1,(err,result)=>{
		if(err) throw err;
        else res.json(result)
	})
})



router.post('/reverse-geocoding',(req,res)=>{

    mapsdk.reverseGeoCodeGivenLatiLongi('l9fksssn2m6snu4dif9d55z7fpwed1kx',req.body.latitude,req.body.longitude).then(function(data)
    {
        res.json(data.results[0].formatted_address)

   

    }).catch(function(ex){
        console.log(ex);
        res.json(ex)
    });
})


router.get('/send-details',(req,res)=>{
    request.get({url:'https://atlas.mapmyindia.com/api/places/nearby/json?keywords=coffee;beer&refLocation=28.5855538,77.3120617',   headers : {"Authorization" : auth}}, function(err,httpResponse,body){
        if(err) res.json(err)
        else {
            res.json(body)
            
        }
     })
})


router.post('/token-generate',(req,res)=>{
    request.post({url:'https://outpost.mapmyindia.com/api/security/oauth/token', form: {grant_type:'client_credentials',client_id:'33OkryzDZsJ-h8BiPzg7amqrEPQwQTvocmRHfjWwefFxpNP3_HurvGVXRAfxAYOj8nf45ZYF8Acm_Id-ue4sn_2A9pFHyxwn47PyMOOxmRrbwthlSOcucw==',client_secret:'lrFxI-iSEg9sxArKVFDeDm0mEIZLGSKwcov3ELR8CbAQm5K0apioxZ9Py4gG5X4-VU9pydJdiFP1UYQPnTo7aMN-HkNogcFlAdLEPPfjC6gQFw6jDtOu--S_tKbsLOXP'}}, function(err,httpResponse,body){
        if(err) res.json(err)
        else {
            res.json(body)
            req.session.token = '2b319bde-1915-4f51-9b63-80ec729ebfdc'

        }
     })
})


// mapsdk.reverseGeoCodeGivenLatiLongi('l9fksssn2m6snu4dif9d55z7fpwed1kx',26.5645,85.9914).then(function(result)
// {
//     console.log(result)
// }).catch(function(ex){
//     console.log(ex)
// });

// router.post('/get-address',(req,res)=>{
//     console.log('body',req.body)
//     mapsdk.reverseGeoCodeGivenLatiLongi('l9fksssn2m6snu4dif9d55z7fpwed1kx','${req.body.latitude}','${req.body.longitude}').then(function(result)
//     {
//        console.log(result)
//     }).catch(function(ex){
//         console.log('ex')
//     });
// })


// const NodeGeocoder = require('node-geocoder');


// var options = {
//     provider: 'google',
//     httpAdapter: 'https', // Default
//     apiKey: 'AIzaSyDlIhpXx1atb7CSctDB8k8bAR3apGG14lM', // for Mapquest, OpenCage, Google Premier
//     formatter: 'json' // 'gpx', 'string', ...
//   };
  



//   var geocoder = NodeGeocoder(options);

// geocoder.reverse({lat:28.5967439, lon:77.3285038}, function(err, res) {
//     if(err) console.log('error',err)
//     else console.log('res',res);
// });

router.get('/',(req,res)=>{
    res.render('admin_login',{msg : ''})
})





router.get('/change-password',(req,res)=>{

    var otp = Math.floor(Math.random()*100000)+1;
    console.log('otp',otp)
        request(`http://mysmsshop.in/V2/http-api.php?apikey=gCuJ0RSBDLC3xKj6&senderid=SAFEDI&number=8319339945&message=Use OTP ${otp} to change password your KH10 Non Veg World Account.&format=json`, { json: true }, (err, result) => {
            if (err) { return console.log(err); }
           else {
               req.session.otp = otp
            res.render('change-password',{msg:''})
           }
        })
       
    })
    
    
    
    
    router.post('/change-password',(req,res)=>{
    
        if(req.session.otp == req.body.otp){
     pool.query(`update admin set password = '${req.body.password}'`,(err,result)=>{
         if(err) throw err;
         else res.render('admin_login',{msg:''})
     })
        }
        else {
            res.render('change-password',{msg:'Invalid OTP'})
        }
           
        })

router.get('/logout',(req,res)=>{
    req.session.adminid = null;
    res.redirect('/admin/pannel/login')
})

router.post('/login',(req,res)=>{
    pool.query(`select * from ${table} where email = '${req.body.email}' and password = '${req.body.password}'`,(err,result)=>{
        if(err) throw err;
        else if(result[0]){
          req.session.adminid = result[0].id
          res.redirect('/admin/pannel/vendors')
        }
        else {
            res.render('admin_login',{msg : 'Invalid Username & Password'})
        }
    })
})


router.get('/location',async(req,res)=>{
    const geocoder = NodeGeocoder(options);
 
// Using callback
const resp = await geocoder.geocode('29 champs elysée paris');
console.log(resp)

})



module.exports = router;
