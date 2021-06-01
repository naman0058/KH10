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

module.exports = router;
