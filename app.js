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
const request = require('request');

// view engine setup
app.set('views', path.join(__dirname,'views'));
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
  password:"784512963",//"784512963",
  host    :"localhost",
  port    :3300,
  database:"library"//"library"
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
app.get('/page', function (req, res) {
  res.sendFile(path.join(__dirname + '/page.html'));
});
app.get('/queries', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/queries.html'));
});

 
app.get('/authors/insert', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/authinsert.html'));
});
app.get('/authors/delete', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/authdelete.html'));
});


var qrs = require("./queries")
app.get('/books', qrs.expo2)
app.get('/authors', qrs.authorShow)
app.post('/authors/insert/success', qrs.authorInsert,qrs.authorShow2)
app.post('/authors/delete/success', qrs.authorDelete, qrs.authorShow3 )
app.post('/books/insert', qrs.bookinsert)
app.get('/members/select', qrs.expo)
app.post('/members/insert', qrs.memberInsert)
app.post('/members/update', qrs.memberUpdate)
app.post('/members/search', qrs.memberSearch)

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
