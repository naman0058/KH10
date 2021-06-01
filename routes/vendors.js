var express = require('express');
var router = express.Router();
var upload = require('./multer');
var pool = require('./pool')
var table = 'vendors';
const request = require('request');

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = mm + '/' + dd + '/' + yyyy; 


router.get('/',(req,res,)=>{
    if(req.session.adminid){
    res.render('vendors')
    }
    else {
        res.render('admin_login',{msg:'Please Login First'})
    }
})






router.post('/insert',upload.single('image'),(req,res)=>{
	let body = req.body
    body['image'] = req.file.filename;
    body['wallet'] = 0;
	pool.query(`insert into ${table} set ?`,body,(err,result)=>{
		if(err) {
            res.json({
                status:500,
                type : 'error',
                description:err
            })
        }
		else {

            request(`http://mysmsshop.in/V2/http-api.php?apikey=gCuJ0RSBDLC3xKj6&senderid=SAFEDI&number=${req.body.number}&message=Hello ${req.body.name} , Download Our App.&format=json`, { json: true }, (err, result) => {
                if (err) { return console.log(err); }
                res.json({
                status:200,
                type : 'success',
                description:'successfully added'
            })
              });

            // res.json({
            //     status:200,
            //     type : 'success',
            //     description:'successfully added'
            // })
            
        }
	})
})


// router.post('/insert',(req,res)=>{
// 	let body = req.body
//    	pool.query(`insert into ${table} set ?`,body,(err,result)=>{
// 		if(err) {
//             res.json({
//                 status:500,
//                 type : 'error',
//                 description:err
//             })
//         }
// 		else {

//             request(`http://mysmsshop.in/V2/http-api.php?apikey=gCuJ0RSBDLC3xKj6&senderid=SAFEDI&number=${req.body.number}&message=Hello ${req.body.name} , Download Our App.&format=json`, { json: true }, (err, result) => {
//                 if (err) { return console.log(err); }
//                 res.json({
//                 status:200,
//                 type : 'success',
//                 description:'successfully added'
//             })
//               });

           
//         }
// 	})
// })



router.get('/all',(req,res)=>{
	pool.query(`select * from ${table}`,(err,result)=>{
		if(err) throw err;
        else res.json(result)
	})
})



router.get('/delete', (req, res) => {
    const { id } = req.query
    pool.query(`delete from ${table} where id = ${id}`, (err, result) => {
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
                description:'successfully delete'
            })
        }
    })
})



router.get('/collect',(req,res)=>{
    pool.query(`select sum(wallet) as total_wallet_amount from ${table} where id = '${req.query.id}'`,(err,result)=>{
        if(err) throw err;
        else {
            let wallet = result[0].total_wallet_amount;
            pool.query(`insert into admin_wallet(store_number,wallet,date) values('${req.query.store_number}','${wallet}', '${today}')`,(err,result)=>{
                if(err) throw err;
                else {
                    pool.query(`update ${table} set wallet = 0 where id = '${req.query.id}'`,(err,result)=>{
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
})


router.post('/update', (req, res) => {
    pool.query(`update ${table} set ? where id = ?`, [req.body, req.body.id], (err, result) => {
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
                description:'successfully update'
            })
        }
    })
})







router.post('/update_image',upload.single('image'), (req, res) => {
    let body = req.body;

    body['image'] = req.file.filename

    pool.query(`update ${table} set ? where id = ?`, [req.body, req.body.id], (err, result) => {
        if(err) {
            res.json({
                status:500,
                type : 'error',
                description:err
            })
        }
        else {
            // res.json({
            //     status:200,
            //     type : 'success',
            //     description:'successfully update'
            // })
            res.redirect('/admin/pannel/vendors')
        }
    })
})




router.get('/details',(req,res)=>{
    if(req.session.adminid){
        var query = `select * from vendors where number = '${req.query.number}';`
        var query1 = `select * from booking where partner_number = '${req.query.number}' and status !='completed';`
        var query2 = `select * from booking where partner_number = '${req.query.number}' and status = 'completed';`
pool.query(query+query1+query2,(err,result)=>{
    if(err) throw err;
    else res.render('vendors_details',{result:result})
    //else res.json(result)
})
        
        
        }
        else {
            res.render('admin_login',{msg:'Please Login First'})
        }
})









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






module.exports = router;