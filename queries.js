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
  password:"password",
  host    :"localhost",
  port    :3300,
  database:"library2"
})

client.connect()
.then(() => console.log("db connected"))
.catch(e => console.log(e))

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: false}))

const memberInsert =(req, res, next) => {
    var text = 'INSERT INTO member(mfirst, mlast) VALUES($1, $2)'
    var firstName = req.body.n1
    var lastName = req.body.n2
    const values = [firstName, lastName]
    console.log('first name:' + firstName + '   last name:' +  lastName ) 
    client.query(text, values, (err, res) => {
      if (err) {
        console.log(err.stack)
      } else {
        console.log('insert success')
      }
    }) 
    client.query('SELECT * FROM member ORDER BY memberid ASC', (error, results,cols) => {
      if (error) {
        throw error
      }
      res.status(200).json(results.rows)
    })
  }
///functions for exporting JSON from query to html
  var reo;
  fs.readFile(path.join(__dirname + '/tab.html'), 'utf8', function read(err, data) {
    if (err) {
        throw err;
    } 
    reo = data;
  });
  const Select = (cb) => { 
    client.query('SELECT * FROM member', (error, res,cols) => {
      if (error) {
        throw error
      }
      var table ='';
      for(var i=0; i<res.rowCount; i++){
        table += '<tr><td>' + res.rows[i].memberid +'</td><td>'+ res.rows[i].mfirst +'</td><td>'+ res.rows[i].mlast +'</td></tr>';
      }
      table ='<table border="1"><tr><th>memberid</th><th>FirstName</th><th>LastName</th></tr>'+ table +'</table>';
      return cb(table);   
    })
  }
  const expo = (req, res,next)=>{
    Select(resql=>{
      reo = reo.replace('{${table}}', resql);
      res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
      res.write(reo, 'utf-8');
      res.end();
    })
  }

  ///same functions for books
  var reo2;
      fs.readFile(path.join(__dirname + '/public/books.html'), 'utf8', function read(err, data) {
      if (err) {
        throw err;
      } 
      reo2 = data;
  });
  const Select2 = (cb) => { 
    client.query('SELECT * FROM book', (error, res,cols) => {
      if (error) {
        throw error
      }
      var table ='';
      for(var i=0; i<res.rowCount; i++){
        table += '<tr><td>' + res.rows[i].isbn +'</td><td>'+ res.rows[i].numpages +'</td><td>'+ res.rows[i].title +'</td></tr>';
      }
      table ='<table border="1"><tr><th>isbn</th><th>numpagges</th><th>title</th></tr>'+ table +'</table>';
      return cb(table);   
    })
  }
  const expo2 = (req, res,next)=>{
    Select2(resql=>{
      reo2 = reo2.replace('{${table}}', resql);
      res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
      res.write(reo2, 'utf-8');
      res.end();
    })
  }

  const bookinsert =(req, res, next) => {
    var text = 'INSERT INTO book(isbn, title, numpages) VALUES($1, $2, $3)'
    var isbn = req.body.n21
    var title = req.body.n22
    var numpages = req.body.n23
    const values = [isbn, title ,numpages]
    console.log('inside')
    client.query(text, values, (err, res) => {
      if (err) {
        console.log(err.stack)
      } else {
        console.log('insert success')
      }
    })
    client.query('SELECT * FROM book ORDER BY isbn ASC', (error, results, cols) => {
      if (error) {
        throw error
      }
      res.status(200).json(results.rows)
    })
}
    
  



  





  
//////////////////
 const memberUpdate = (req, res) => {
    var mfirst = req.body.n4
    var mlast =  req.body.n5
    var memberID = req.body.n6
    const values = [mfirst, mlast, memberID]
    client.query(
     'UPDATE member SET mfirst = $1, mlast = $2 WHERE memberid = $3', 
     values,  (error, results) => {
        if (error) {
          throw error
        }
        console.log('update success')
      }
    )
    client.query('SELECT * FROM member ORDER BY memberid ASC',  (error, results) => {
      if (error) {
        throw error
      }
      res.status(200).json(results.rows)
    })
  }
  
  const memberSearch = (req, res) => {
    var SearchTerm = req.body.n7
    const values = [SearchTerm]
    client.query('SELECT * FROM member WHERE memberid = ($1)', values , (error, results) => {
      if (error) {
        throw error
      }
      res.status(200).json(results.rows)
    })
  }

  //QUERIES//

  //arithmos vivliwn ana syggrafea (GROUP BY)
const q1 = (req, res) => {
  client.query('SELECT * FROM written_by GROUP BY authid', (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
}

//

// queries for author table START HERE
// query for showing author entries in first page /authors
var reo2;
fs.readFile(path.join(__dirname + '/public/authors.html'), 'utf8', function read(err, data) {
  if (err) {
      throw err;
  } 
  reo2 = data;
});
const SelectAuthor = (cb,aut) => { 
  client.query('SELECT * FROM author', (error, res,cols) => {
    if (error) {
      throw error
    }
    var tablea ='';
    for(var i=0; i<res.rowCount; i++){
      tablea += '<tr><td>' + res.rows[i].authid +'</td><td>'+ res.rows[i].afirst +'</td><td>'+ res.rows[i].alast +'</td><td>'+ res.rows[i].abirthdate +'</td></tr>';
    }
    tablea ='<table border="1"><tr><th>Author ID</th><th>First Name</th><th>Last Name</th><th>Date of Birth</th></tr>'+ tablea +'</table>';
    return cb(tablea);   
  })
}
const authorShow = (req, res,next)=>{

  SelectAuthor(resql=>{
    reo2 = reo2.replace('{${table}}', resql);
    res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    res.write(reo2, 'utf-8');
    res.end();
  })
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
  })
  next()
}
// Query for showing new insert after successful insert follows with next()
var aut2
fs.readFile(path.join(__dirname + '/public/authinsertsuccess.html'), 'utf8', function read(err, data) {
  if (err) {
      throw err;
  } 
  aut2 = data;
});
const SelectAuthor2 = (cb) => { 
  console.log('22222222222')
  client.query('SELECT * FROM author WHERE afirst = ($1) AND alast = ($2) ',
    values , (error, res,cols) => {
      if (error) {
        throw error
      }
    var table2 ='';
    for(var i=0; i<res.rowCount; i++){
      table2 += '<tr><td>' + res.rows[i].authid +'</td><td>'+ res.rows[i].afirst +'</td><td>'+ res.rows[i].alast +'</td><td>'+ res.rows[i].abirthdate +'</td></tr>';
    }
    table2 ='<table border="1"><tr><th>Author ID</th><th>First Name</th><th>Last Name</th><th>Date of Birth</th></tr>'+ table2 +'</table>';
    return cb(table2);  
    })
}
const authorShow2 = (req, res,next)=>{

  var afirst = req.body.a1
  var alast = req.body.a2
  values = [afirst, alast]
  SelectAuthor2(resql=>{
    aut2 = aut2.replace('{${table}}', resql);
    res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    res.write(aut2, 'utf-8');
    res.end();
  })
}
// Query for deleting author
const authorDelete = (req, res, next) => {
  console.log('ayth')
  var text = 'DELETE FROM  author WHERE authid = ($1) '
  var deleteID = req.body.a4
  var values = [deleteID]
  console.log(deleteID)
  client.query(text, values, (err, res, next) => {
    if (err) {
      console.log(err.stack)
    } else {
    }
    console.log('delete suces')
  })
  next()
}
var aut3
fs.readFile(path.join(__dirname + '/public/authdeletesuccess.html'),
 'utf8', function read(err, data) {
  if (err) {
      throw err;
  } 
  aut3 = data;
});
const authorShow3 = (req, res,next)=>{
    res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    res.write(aut3, 'utf-8');
    res.end();
}



  module.exports = {
    memberInsert,
    memberUpdate,
    memberSearch,
    Select,
    expo,
    expo2,
    Select2,
    bookinsert,
    authorShow,
    authorInsert,
    authorShow2,
    authorDelete,
    authorShow3,

  }