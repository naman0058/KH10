var express = require('express');
var router = express.Router();
var upload = require('./multer');
var pool = require('./pool')
var table = 'services';



router.get('/',(req,res)=>{
    if(req.session.adminid){
    res.render('services')
    }
    else {
        res.render('admin_login',{msg:'Please Login First'})
    }
})




router.get('/menu/manage',(req,res)=>{
    if(req.session.adminid){
    res.render('menu_manage')
    }
    else {
        res.render('admin_login',{msg:'Please Login First'})
    }
})













router.post('/insert',upload.single('image'),(req,res)=>{
	let body = req.body
    
    // let discount = ((+req.body.price)*(+req.body.discount))/100
    // console.log("discount",discount)
    //  let net_amount = (req.body.price) - (discount)
    //  body['net_amount'] = req.body.price
    body['image'] = req.file.filename;

console.log('d',req.body)

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
	pool.query(`select s.* , 
    (select c.name from category c where c.id = s.categoryid) as categoryname,
    (select sub.name from subcategory sub where sub.id = s.subcategoryid) as subcategoryname
    from ${table} s `,(err,result)=>{
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


router.post('/update', (req, res) => {
    let body = req.body
    console.log(req.body)
   //  body['net_amount'] = net_amount
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
            res.redirect('/admin/pannel/services')
        }
    })
})





router.post('/services',(req,res)=>{
    var query = `select  s.*,
                  (select su.name from category su where su.id = s.categoryid) as categoryname, 
                  (select c.quantity from cart c where c.booking_id = s.id and c.usernumber = '${req.body.number}' ) as userquantity
                   from services s where s.categoryid = '${req.body.categoryid}';`
 var query1 = `select sum(quantity) as counter from cart where usernumber ='${req.body.number}';`
    
  pool.query(query+query1,(err,result)=>{
      if(err) throw err;
      else res.json(result)
  })
})




///menu manage




router.post('/menu/insert',(req,res)=>{
	let body = req.body
    
  

console.log('d',req.body)

	pool.query(`insert into menu_manage set ?`,body,(err,result)=>{
        // console.log(result)
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




router.get('/menu/all',(req,res)=>{
	pool.query(`select s.* , 
    (select p.name from services p where p.id = s.productid) as productname
    from menu_manage s `,(err,result)=>{
		if(err) throw err;
        else res.json(result)
	})
})





router.get('/menu/delete', (req, res) => {
    const { id } = req.query
    pool.query(`delete from menu_manage where id = ${id}`, (err, result) => {
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






router.post('/menu/update', (req, res) => {
    let body = req.body
    console.log(req.body)
   //  body['net_amount'] = net_amount
    pool.query(`update menu_manage set ? where id = ?`, [req.body, req.body.id], (err, result) => {
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



module.exports = router;