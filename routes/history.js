var express = require('express');
var router = express.Router();
var upload = require('./multer');
var pool = require('./pool')
var table = 'category';
const fs = require("fs");



router.get('/',(req,res)=>{
    if(req.session.adminid){
        var query = `select count(id) as orders from booking where date = CURDATE();`
        var query8 = `select * from booking where date = CURDATE();`
        var query1 = `select count(id) as orders from booking where status !='completed' and date = CURDATE();`
        var query2 = `select count(id) as orders from booking where status = 'completed' and date = CURDATE();`
        var query3 = `select count(id) as orders from booking;`
        var query4 = `select sum(amount) as orders from booking where date = CURDATE();`
        var query5 = `select sum(wallet) as orders from users;`
        var query6 = `select count(id) as orders from vendors;`
        var query7 = `select count(id) as orders from users;`
     
        pool.query(query+query8+query1+query2+query3+query4+query5+query6+query7,(err,result)=>{
            if(err) throw err;
            else  res.render('history',{result:result})
        })
       
    }
    else {
        res.render('admin_login',{msg:'Please Login First'})
    }
  // res.render('category')
    
})


router.post('/storeEditId',(req,res)=>{
    req.session.editStoreId = req.body.id
    res.send('success')
})


router.post('/insert',upload.single('image'),(req,res)=>{
	let body = req.body
    body['image'] = req.file.filename;
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
                description:'successfully added'
            })
            
        }
	})
})



router.get('/all',(req,res)=>{
	pool.query(`select * from ${table} `,(err,result)=>{
		if(err) throw err;
        else res.json(result)
	})
})



router.get('/delete', (req, res) => {
    let body = req.body
    pool.query(`delete from ${table} where id = ${req.query.id}`, (err, result) => {
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


    pool.query(`select image from ${table} where id = '${req.body.id}'`,(err,result)=>{
        if(err) throw err;
        else {
            fs.unlinkSync(`public/images/${result[0].image}`); 


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

            res.redirect('/category')
        }
    })


        }
    })

  
   
})



router.get('/search',(req,res)=>{
    console.log('query',req.query)
    pool.query(`SELECT b.* , (select v.name from vendors v where v.number = b.partner_number) as vendorname FROM booking b WHERE b.date BETWEEN '${req.query.from_date}' AND '${req.query.to_date}';`,(err,result)=>{
        if(err) throw err;
       
        else {
            console.log('result',result)
            res.json(result)
        }
    })
})


module.exports = router;