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
const  Pool  = require('pg')
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
  password:"784512963",
  host    :"localhost",
  port    :3300,
  database:"library"
})

client.connect()
.then(() => console.log("db connected"))
.catch(e => console.log(e))

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: false}))

// queries for book table START HERE
// query for showing book entries in first page /book
const SelectBook1 = (cb) => { 
  client.query('SELECT * FROM book ORDER BY ISBN ASC', (error, res,cols) => {
    if (error) {
      throw error
    }
    var tablebo1 ='';
    for(var i=0; i<res.rowCount; i++){
      tablebo1 += '<tr><td>' + res.rows[i].authid +'</td><td>'+ res.rows[i].afirst +'</td><td>'+ res.rows[i].alast +'</td><td>'+ res.rows[i].abirthdate +'</td></tr>';
    }
    tablebo1 ='<table border="1"><tr><th>Author ID</th><th>First Name</th><th>Last Name</th><th>Date of Birth</th></tr>'+ tablebo1 +'</table>';
    return cb(tablebo1);   
  })
}
const bookShow1 = (req, res,next)=>{
  var bo1;
fs.readFile(path.join(__dirname + '/public/book/book.html'), 'utf8', function read(err, data) {
  if (err) {
      throw err;
  } 
  bo1 = data;
  SelectBook1(resql=>{
    bo1 = bo1.replace('{${table}}', resql);
    res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    res.write(bo1, 'utf-8');
    res.end();
  })
});
 
}
// Query for Inserting a new author into the db
const bookInsert =(req, res, next) => {
  var text = 'INSERT INTO book(afirst, alast, abirthdate) VALUES($1, $2, $3)'
  var afirst = req.body.a1
  var alast = req.body.a2
  var abirthdate = req.body.a3
  var values = [afirst, alast, abirthdate]
  client.query(text, values, (err, res, next) => {
    if (err) {
      console.log(err.stack)
    } else {
    }
    console.log('Inserted successfully!')
  })
  next()
}
// Query for showing new insert after successful insert follows with next()
const SelectBook2 = (cb) => { 
  client.query('SELECT * FROM book WHERE afirst = ($1) AND alast = ($2) ',
    values , (error, res,cols) => {
      if (error) {
        throw error
      }
    var tablebo2 ='';
    for(var i=0; i<res.rowCount; i++){
      tablebo2 += '<tr><td>' + res.rows[i].authid +'</td><td>'+ res.rows[i].afirst +'</td><td>'+ res.rows[i].alast +'</td><td>'+ res.rows[i].abirthdate +'</td></tr>';
    }
    tablebo2 ='<table border="1"><tr><th>Author ID</th><th>First Name</th><th>Last Name</th><th>Date of Birth</th></tr>'+ tablebo2 +'</table>';
    return cb(tablebo2);  
    })
}
const bookShow2 = (req, res,next)=>{
  var afirst = req.body.a1
  var alast = req.body.a2
  values = [afirst, alast]
  var bo2
  fs.readFile(path.join(__dirname + '/public/book/bookinsertsuccess.html'), 'utf8', function read(err, data) {
  if (err) {
      throw err;
  } 
  bo2 = data;
  SelectBook2(resql=>{
    bo2 = bo2.replace('{${table}}', resql);
    res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    res.write(bo2, 'utf-8');
    res.end();
  })
});
}
// Query for deleting author
const bookDelete = (req, res, next) => {
  var text = 'DELETE FROM  book WHERE authid = ($1) '
  var deleteID = req.body.a4
  var values = [deleteID]
  console.log(deleteID)
  client.query(text, values, (err, res, next) => {
    if (err) {
      console.log(err.stack)
    } else {
    }
    console.log('Deleted successfully!')
  })
  next()
}
const bookShow3 = (req, res,next)=>{
  var bo3
  fs.readFile(path.join(__dirname + '/public/book/bookdeletesuccess.html'),
 'utf8', function read(err, data) {
  if (err) {
      throw err;
  } 
  bo3 = data;
  res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    res.write(bo3, 'utf-8');
    res.end();
  });
}
// Query for updating author
const bookUpdate =(req, res, next) => {
  var text = 'UPDATE book SET afirst = ($1), alast = ($2) , abirthdate = ($3) WHERE authid = ($4)'
  var authid = req.body.a5
  var afirst = req.body.a6
  var alast = req.body.a7
  var abirthdate = req.body.a8
  var values = [afirst, alast, abirthdate, authid]
  client.query(text, values, (err, res, next) => {
    if (err) {
      console.log(err.stack)
    } else {
    }
    console.log('Updated successfully!')
  })
  next()
}
const SelectBook4 = (cb) => { 
  client.query('SELECT * FROM book WHERE authid = ($1) ',
    values , (error, res,cols) => {
      if (error) {
        throw error
      }
    var tablebo4 ='';
    for(var i=0; i<res.rowCount; i++){
      tablebo4 += '<tr><td>' + res.rows[i].authid +'</td><td>'+ res.rows[i].afirst +'</td><td>'+ res.rows[i].alast +'</td><td>'+ res.rows[i].abirthdate +'</td></tr>';
    }
    tablebo4 ='<table border="1"><tr><th>Author ID</th><th>First Name</th><th>Last Name</th><th>Date of Birth</th></tr>'+ tablebo4 +'</table>';
    return cb(tablebo4);  
    })
}
const bookShow4 = (req, res,next)=>{
  var bo4
  var bid = req.body.a5
  values = [ bid ]
  fs.readFile(path.join(__dirname + '/public/book/bookupdatesuccess.html'), 'utf8', function read(err, data) {
  if (err) {
      throw err;
  } 
  bo4 = data;
  SelectBook4(resql=>{
    bo4 = bo4.replace('{${table}}', resql);
    res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    res.write(bo4, 'utf-8');
    res.end();
  })
  });
}
// queries for book table END HERE

// queries for author table START HERE
// query for showing author entries in first page /authors
const SelectAuthor1 = (cb) => { 
  client.query('SELECT * FROM author ORDER BY authid ASC', (error, res,cols) => {
    if (error) {
      throw error
    }
    var tableauth1 ='';
    for(var i=0; i<res.rowCount; i++){
      tableauth1 += '<tr><td>' + res.rows[i].authid +'</td><td>'+ res.rows[i].afirst +'</td><td>'+ res.rows[i].alast +'</td><td>'+ res.rows[i].abirthdate +'</td></tr>';
    }
    tableauth1 ='<table border="1"><tr><th>Author ID</th><th>First Name</th><th>Last Name</th><th>Date of Birth</th></tr>'+ tableauth1 +'</table>';
    return cb(tableauth1);   
  })
}
const authorShow1 = (req, res,next)=>{
  var auth1;
fs.readFile(path.join(__dirname + '/public/auth/authors.html'), 'utf8', function read(err, data) {
  if (err) {
      throw err;
  } 
  auth1 = data;
  SelectAuthor1(resql=>{
    auth1 = auth1.replace('{${table}}', resql);
    res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    res.write(auth1, 'utf-8');
    res.end();
  })
});
 
}
// Query for Inserting a new author into the db
const authorInsert =(req, res, next) => {
  var text = 'INSERT INTO author(afirst, alast, abirthdate) VALUES($1, $2, $3)'
  var afirst = req.body.a1
  var alast = req.body.a2
  var abirthdate = req.body.a3
  var values = [afirst, alast, abirthdate]
  client.query(text, values, (err, res, next) => {
    if (err) {
      console.log(err.stack)
    } else {
    }
    console.log('Inserted successfully!')
  })
  next()
}
// Query for showing new insert after successful insert follows with next()
const SelectAuthor2 = (cb) => { 
  client.query('SELECT * FROM author WHERE afirst = ($1) AND alast = ($2) ',
    values , (error, res,cols) => {
      if (error) {
        throw error
      }
    var tableauth2 ='';
    for(var i=0; i<res.rowCount; i++){
      tableauth2 += '<tr><td>' + res.rows[i].authid +'</td><td>'+ res.rows[i].afirst +'</td><td>'+ res.rows[i].alast +'</td><td>'+ res.rows[i].abirthdate +'</td></tr>';
    }
    tableauth2 ='<table border="1"><tr><th>Author ID</th><th>First Name</th><th>Last Name</th><th>Date of Birth</th></tr>'+ tableauth2 +'</table>';
    return cb(tableauth2);  
    })
}
const authorShow2 = (req, res,next)=>{
  var afirst = req.body.a1
  var alast = req.body.a2
  values = [afirst, alast]
  var auth2
  fs.readFile(path.join(__dirname + '/public/auth/authinsertsuccess.html'), 'utf8', function read(err, data) {
  if (err) {
      throw err;
  } 
  auth2 = data;
  SelectAuthor2(resql=>{
    auth2 = auth2.replace('{${table}}', resql);
    res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    res.write(auth2, 'utf-8');
    res.end();
  })
});
}
// Query for deleting author
const authorDelete = (req, res, next) => {
  var text = 'DELETE FROM  author WHERE authid = ($1) '
  var deleteID = req.body.a4
  var values = [deleteID]
  console.log(deleteID)
  client.query(text, values, (err, res, next) => {
    if (err) {
      console.log(err.stack)
    } else {
    }
    console.log('Deleted successfully!')
  })
  next()
}
const authorShow3 = (req, res,next)=>{
  var auth3
  fs.readFile(path.join(__dirname + '/public/auth/authdeletesuccess.html'),
 'utf8', function read(err, data) {
  if (err) {
      throw err;
  } 
  auth3 = data;
  res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    res.write(auth3, 'utf-8');
    res.end();
  });
}
// Query for updating author
const authorUpdate =(req, res, next) => {
  var text = 'UPDATE author SET afirst = ($1), alast = ($2) , abirthdate = ($3) WHERE authid = ($4)'
  var authid = req.body.a5
  var afirst = req.body.a6
  var alast = req.body.a7
  var abirthdate = req.body.a8
  var values = [afirst, alast, abirthdate, authid]
  client.query(text, values, (err, res, next) => {
    if (err) {
      console.log(err.stack)
    } else {
    }
    console.log('Updated successfully!')
  })
  next()
}
const SelectAuthor4 = (cb) => { 
  client.query('SELECT * FROM author WHERE authid = ($1) ',
    values , (error, res,cols) => {
      if (error) {
        throw error
      }
    var table4 ='';
    for(var i=0; i<res.rowCount; i++){
      table4 += '<tr><td>' + res.rows[i].authid +'</td><td>'+ res.rows[i].afirst +'</td><td>'+ res.rows[i].alast +'</td><td>'+ res.rows[i].abirthdate +'</td></tr>';
    }
    table4 ='<table border="1"><tr><th>Author ID</th><th>First Name</th><th>Last Name</th><th>Date of Birth</th></tr>'+ table4 +'</table>';
    return cb(table4);  
    })
}
const authorShow4 = (req, res,next)=>{
  var auth4
  var aid = req.body.a5
  values = [ aid ]
  fs.readFile(path.join(__dirname + '/public/auth/authupdatesuccess.html'), 'utf8', function read(err, data) {
  if (err) {
      throw err;
  } 
  auth4 = data;
  SelectAuthor4(resql=>{
    auth4 = auth4.replace('{${table}}', resql);
    res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    res.write(auth4, 'utf-8');
    res.end();
  })
  });
}
// queries for author table END HERE


  module.exports = {
    bookShow1,
    bookInsert,
    bookShow2,
    bookDelete,
    bookShow3,
    bookUpdate,
    bookShow4,

    authorShow1,
    authorInsert,
    authorShow2,
    authorDelete,
    authorShow3,
    authorUpdate,
    authorShow4,
}