var createError = require("http-errors");
var cookieSession = require("cookie-session");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require('morgan')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var category = require('./routes/category');
var subcategory = require('./routes/subcategory');
var services = require('./routes/services');
var cart = require('./routes/cart');
var checkout = require('./routes/checkout');
var vendors = require('./routes/vendors');
var requested = require('./routes/RequestedPayment')
var admin = require('./routes/admin')
var orders = require('./routes/booking')
var delievery_boy = require('./routes/delieveryBoy')
var partner_api = require('./routes/partner_api');
var history = require('./routes/history');
var banner_image = require('./routes/banner_image')
var api = require('./routes/api');
var timeslot = require('./routes/timeslot');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(
  cookieSession({
    name: "session",
    keys: ["naman"],

     //Cookie Options
    maxAge: 168 * 60 * 60 * 100 // 24 hours
  })
);

app.use('/', indexRouter);
app.use('/admin/pannel/users', usersRouter);
app.use('/admin/pannel/category',category);
app.use('/admin/pannel/subcategory',subcategory)
app.use('/admin/pannel/services',services);
app.use('/cart',cart);
app.use('/checkout',checkout);
app.use('/admin/pannel/vendors',vendors);
app.use('/admin/pannel/requested-payment',requested)
app.use('/admin/pannel/login',admin)
app.use('/admin/pannel/orders',orders)
app.use('/admin/pannel/delieveryBoy',delievery_boy)
app.use('/partner-api',partner_api);
app.use('/admin/pannel/history',history);
app.use('/admin/pannel/banner-image',banner_image);
app.use('/time-slot',timeslot);

app.use('/api',api);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
