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

var qrs = require("./queries")  //functions import from queries.js
//7 queries routing
app.get('/bookauthor', qrs.bookAuthorShow)
app.get('/bookpublisher', qrs.bookPublisherShow)
app.get('/bookpublisher2', qrs.bookPublisherShow2)
app.get('/membersort', qrs.memberSortShow)
app.get('/memberpostal', qrs.memberPostalShow)
app.get('/bookcat', qrs.bookCatShow)
app.get('/bookcopy', qrs.bookCopyShow)

 //authors routing
app.get('/authors/insert', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/auth/authinsert.html'));
});
app.get('/authors/delete', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/auth/authdelete.html'));
});
app.get('/authors/update', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/auth/authupdate.html'));
});
app.get('/authors', qrs.authorShow1)
app.post('/authors/insert/success', qrs.authorInsert,qrs.authorShow2)
app.post('/authors/delete/success', qrs.authorDelete,qrs.authorShow3 )
app.post('/authors/update/success', qrs.authorUpdate, qrs.authorShow4)

 //book routing
 app.get('/book/insert', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/book/bookinsert.html'));
});
app.get('/book/delete', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/book/bookdelete.html'));
});
app.get('/book/update', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/book/bookupdate.html'));
});
app.get('/book', qrs.bookShow1)
app.post('/book/insert/success', qrs.bookInsert,qrs.bookShow2)
app.post('/book/delete/success', qrs.bookDelete,qrs.bookShow3)
app.post('/book/update/success', qrs.bookUpdate, qrs.bookShow4)


 //member routing
 app.get('/member/insert', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/member/memberinsert.html'));
});
app.get('/member/delete', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/member/memberdelete.html'));
});
app.get('/member/update', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/member/memberupdate.html'));
});
app.get('/member', qrs.memberShow1)
app.post('/member/insert/success', qrs.memberInsert,qrs.memberShow2)
app.post('/member/delete/success', qrs.memberDelete,qrs.memberShow3)
app.post('/member/update/success', qrs.memberUpdate, qrs.memberShow4)









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
