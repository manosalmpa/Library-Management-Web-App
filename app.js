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

//var reo ='<html><head><title>Node.js MySQL Select</title></head><body><h1>Node.js MySQL Select</h1>{${table}}<h2>HEADER 2</h2></body></html>';
 
var reo;
fs.readFile(path.join(__dirname + '/tab.html'), 'utf8', function read(err, data) {
    if (err) {
        throw err;
    } console.log(data)
    reo = data;
});

console.log(reo)
var qrs = require("./queries")
app.post('/members/select', (req, res,next)=>{
  qrs.Select(resql=>{
    reo = reo.replace('{${table}}', resql);
    res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    res.write(reo, 'utf-8');
    res.end();
  });
})
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
