var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const morgan = require('morgan');
var Client = require('pg').Client;
var fs = require('fs');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(morgan('short'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', indexRouter);
app.use('/users', usersRouter);

//postgresql database setup
var client = new Client({
  user    :"postgres",
  password:"password",//"784512963",
  host    :"localhost",
  port    :3300,
  database:"library1"//"library"
})

client.connect()
.then(() => console.log("db connected"))
.catch(e => console.log(e))

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: false}))

app.get('/home', function(req, res) {
  res.sendFile(path.join(__dirname + '/views/homepage.html'));
});
app.get('/index', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});
app.get('/members', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/members.html'));
});

var qrs = require("./queries");
app.post('/members', qrs.memberInsert )
app.post('/updateresults', qrs.memberUpdate )
app.post('/searchresults',qrs.memberSearch)

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
