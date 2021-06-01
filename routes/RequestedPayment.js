var express = require('express');
var router = express.Router();
var upload = require('./multer');
var pool = require('./pool')
var table = 'transcations';



router.get('/',(req,res)=>{
    if(req.session.adminid){
   res.render('requested_payment')
    }
    else {
        res.render('admin_login',{msg:'Please Login First'})    
    }
    
})







router.get('/all',(req,res)=>{
	pool.query(`select * from ${table} where status = 'bonus_pending' `,(err,result)=>{
		if(err) throw err;
        else res.json(result)
	})
})





router.post('/send-amount', (req, res) => {
    pool.query(`update ${table} set status = 'success' where id = '${req.body.id}'` , (err, result) => {
        if(err) {
            res.json({
                status:500,
                type : 'error',
                description:err
            })
        }
        else {

            pool.query(`update users set wallet = wallet + '${req.body.extra}'  where number ='${req.body.number}'`,  (err, result) => {
                if(err) {
                    res.json({
                        status:500,
                        type : 'error',
                        description:err
                    })
                }
                else{
                res.send('success')
                }
            })
           

            
        }
    })
})








module.exports = router;