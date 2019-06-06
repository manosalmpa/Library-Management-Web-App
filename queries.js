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
  password:"password",//"784512963",
  host    :"localhost",
  port    :3300,
  database:"library1"
})

client.connect()
.then(() => console.log("db connected"))
.catch(e => console.log(e))

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: false}))

// 1 showing book-author query
const bookAuthor =(cb) => {
  var text = 'SELECT book.title, sub.afirst, sub.alast, sub.isbn FROM ';
  text = text + '(SELECT author.authid, author.afirst, author.alast, written_by.isbn '
  text = text + ' FROM author FULL JOIN written_by ON author.authid = written_by.authid'
  text = text + ' WHERE written_by.isbn IS NOT NULL) AS sub FULL JOIN book';
  text = text + ' ON book.isbn = sub.isbn;';
  console.log(text)
  client.query(text, (error, res,cols) => {
    if (error) {
      console.log(error)
    throw error
  }
  console.log('query')
  var tableba ='';
  for(var i=0; i<res.rowCount; i++){
    tableba += '<tr><td>' + res.rows[i].title +'</td><td>' + res.rows[i].afirst +'</td><td>' + res.rows[i].alast +'</td><td>' + res.rows[i].isbn +'</td></tr>';
  }
  tableba ='<table border="1"><tr><th> Book title </th><th> Author first name </th><th> Author last name</th><th> ISBN </th></tr>'+ tableba +'</table>';
  return cb(tableba);   
})
}
const bookAuthorShow = (req, res,next)=>{
  var ba;
fs.readFile(path.join(__dirname + '/public/qrs/bookauthor.html'), 'utf8', function read(err, data) {
  if (err) {
      throw err;
  } 
  ba = data;
  bookAuthor(resql=>{
    ba = ba.replace('{${table}}', resql);
    res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    res.write(ba, 'utf-8');
    res.end();
  })
});
}
// 2 showing book per publisher
const bookPublisher =(cb) => {
  var text = ' SELECT publisher.pubname, COUNT(book.isbn) '
  text = text + ' FROM publisher FULL JOIN book '
  text = text + ' ON publisher.pubname = book.pubname WHERE '
  text = text + ' publisher.pubname IS NOT NULL '
  text = text + ' GROUP BY publisher.pubname '
  console.log(text)
  client.query(text, (error, res,cols) => {
    if (error) {
      console.log(error)
    throw error
  }
  var tablebp ='';
  for(var i=0; i<res.rowCount; i++){
    tablebp += '<tr><td>' + res.rows[i].pubname +'</td><td>' + res.rows[i].count +'</td></tr>';
  }
  tablebp ='<table border="1"><tr><th> Publisher </th><th> Number of books </th></tr>'+ tablebp +'</table>';
  return cb(tablebp);   
})
}
const bookPublisherShow = (req, res,next)=>{
  var bp;
fs.readFile(path.join(__dirname + '/public/qrs/bookpublisher.html'), 'utf8', function read(err, data) {
  if (err) {
      throw err;
  } 
  bp = data;
  bookPublisher(resql=>{
    bp = bp.replace('{${table}}', resql);
    res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    res.write(bp, 'utf-8');
    res.end();
  })
});
}
//3 showing book per publisher when books/publisher > 2
const bookPublisher2 =(cb) => {
  var text = ' SELECT publisher.pubname, COUNT(book.isbn) '
  text = text + ' FROM publisher FULL JOIN book '
  text = text + ' ON publisher.pubname = book.pubname '
  text = text + ' WHERE publisher.pubname IS NOT NULL '
  text = text + ' GROUP BY publisher.pubname HAVING COUNT(book.isbn)>2 '
  console.log(text)
  client.query(text, (error, res,cols) => {
    if (error) {
      console.log(error)
    throw error
  }
  var tablebp2 ='';
  for(var i=0; i<res.rowCount; i++){
    tablebp2 += '<tr><td>' + res.rows[i].pubname +'</td><td>' + res.rows[i].count +'</td></tr>';
  }
  tablebp2 ='<table border="1"><tr><th> Publisher </th><th> Number of books </th></tr>'+ tablebp2 +'</table>';
  return cb(tablebp2);   
})
}
const bookPublisherShow2 = (req, res,next)=>{
  var bp2;
fs.readFile(path.join(__dirname + '/public/qrs/bookpublisher2.html'), 'utf8', function read(err, data) {
  if (err) {
      throw err;
  } 
  bp2 = data;
  bookPublisher2(resql=>{
    bp2 = bp2.replace('{${table}}', resql);
    res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    res.write(bp2, 'utf-8');
    res.end();
  })
});
}
// 4 Show members order by Last name
const memberSort =(cb) => {
  var text = ' SELECT member.mfirst,member.mlast,member.memberid '
  text = text + ' FROM member ORDER BY member.mlast '
  client.query(text, (error, res,cols) => {
    if (error) {
      console.log(error)
    throw error
  }
  var tablems ='';
  for(var i=0; i<res.rowCount; i++){
    tablems += '<tr><td>' + res.rows[i].mfirst +'</td><td>' + res.rows[i].mlast +'</td><td>' + res.rows[i].memberid +'</td></tr>';
  }
  tablems ='<table border="1"><tr><th> First Name </th><th> Last Name </th><th> Member ID </th></tr>'+ tablems +'</table>';
  return cb(tablems);   
})
}
const memberSortShow = (req, res,next)=>{
  var ms;
fs.readFile(path.join(__dirname + '/public/qrs/membersort.html'), 'utf8', function read(err, data) {
  if (err) {
      throw err;
  } 
  ms = data;
  memberSort(resql=>{
    ms = ms.replace('{${table}}', resql);
    res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    res.write(ms, 'utf-8');
    res.end();
  })
});
}
// 5 show members with mobile phone (aggregate)
const memberPostal =(cb) => {
  var text = ' SELECT member.memberid, member.mfirst, '
  text = text + '  member.mlast, member.postalcode '
  text = text + ' FROM member WHERE CAST '
  text = text + " (member.postalcode as TEXT) LIKE '157%' "
  client.query(text, (error, res,cols) => {
    if (error) {
      console.log(error)
    throw error
  }
  var tablemp ='';
  for(var i=0; i<res.rowCount; i++){
    tablemp += '<tr><td>' + res.rows[i].memberid +'</td><td>' + res.rows[i].mfirst +'</td><td>' + res.rows[i].mlast +'</td><td>' + res.rows[i].postalcode +'</td></tr>';
  }
  tablemp ='<table border="1"><tr><th> Member ID </th><th> First Name </th><th> Last Name </th><th> Postal Code </th></tr>'+ tablemp +'</table>';
  return cb(tablemp);   
})
}
const memberPostalShow = (req, res,next)=>{
  var mp;
fs.readFile(path.join(__dirname + '/public/qrs/memberpostal.html'), 'utf8', function read(err, data) {
  if (err) {
      throw err;
  } 
  mp = data;
  memberPostal(resql=>{
    mp = mp.replace('{${table}}', resql);
    res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    res.write(mp, 'utf-8');
    res.end();
  })
});
}
// 6 all books with their categories
const bookCat =(cb) => {
  var text = ' SELECT book.isbn, book.title, '
  text = text + '  book.numpages, belongs_to.categoryname '
  text = text + ' FROM book FULL JOIN '
  text = text + " belongs_to ON book.isbn = belongs_to.isbn "
  text = text + " ORDER BY book.isbn "
  client.query(text, (error, res,cols) => {
    if (error) {
      console.log(error)
    throw error
  }
  var tablebc ='';
  for(var i=0; i<res.rowCount; i++){
    tablebc += '<tr><td>' + res.rows[i].isbn +'</td><td>' + res.rows[i].title +'</td><td>' + res.rows[i].numpages +'</td><td>' + res.rows[i].categoryname +'</td></tr>';
  }
  tablebc ='<table border="1"><tr><th> ISBN </th><th> Title </th><th> Number of pages </th><th> Category name </th></tr>'+ tablebc +'</table>';
  return cb(tablebc);   
})
}
const bookCatShow = (req, res,next)=>{
  var bc;
fs.readFile(path.join(__dirname + '/public/qrs/bookcat.html'), 'utf8', function read(err, data) {
  if (err) {
      throw err;
  } 
  bc = data;
  bookCat(resql=>{
    bc = bc.replace('{${table}}', resql);
    res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    res.write(bc, 'utf-8');
    res.end();
  })
});
}
// 7 show copies per book
const bookCopy =(cb) => {
  var text = '  SELECT copies.isbn, COUNT(copies.copynr) '
  text = text + ' FROM copies GROUP BY copies.isbn '
  console.log(text)
  client.query(text, (error, res,cols) => {
    if (error) {
      console.log(error)
    throw error
  }
  var tablebc ='';
  for(var i=0; i<res.rowCount; i++){
    tablebc += '<tr><td>' + res.rows[i].isbn +'</td><td>' + res.rows[i].count +'</td></tr>';
  }
  tablebc ='<table border="1"><tr><th> ISBN  </th><th> Number of copies </th></tr>'+ tablebc +'</table>';
  return cb(tablebc);   
})
}
const bookCopyShow = (req, res,next)=>{
  var bc;
  console.log('inside')
fs.readFile(path.join(__dirname + '/public/qrs/bookcopy.html'), 'utf8', function read(err, data) {
  if (err) {
      throw err;
  } 
  bc = data;
  bookCopy(resql=>{
    bc = bc.replace('{${table}}', resql);
    res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    res.write(bc, 'utf-8');
    res.end();
  })
});
}

////////////////////////////////////////////////////////////////
// queries for book table START HERE
// query for showing book entries in first page /book
const SelectBook1 = (cb) => { 
  client.query('SELECT * FROM book ORDER BY isbn ASC', (error, res,cols) => {
    if (error) {
      throw error
    }
    console.log('query')
    var tablebo1 ='';
    for(var i=0; i<res.rowCount; i++){
      tablebo1 += '<tr><td>' + res.rows[i].isbn +'</td><td>'+ res.rows[i].title +'</td><td>'+ res.rows[i].pubyear +'</td><td>'+ res.rows[i].numpages +'</td><td>' + res.rows[i].pubname +'</td></tr>';
    }
    tablebo1 ='<table border="1"><tr><th>ISBN </th><th> Title </th><th>Year of Publishment </th><th>Number of Pages</th><th>Publisher</th></tr>'+ tablebo1 +'</table>';
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
// Query for Inserting a new book into the db
const bookInsert =(req, res, next) => {
  var text = 'INSERT INTO book(isbn, title, pubyear, numpages, pubname) VALUES($1, $2, $3, $4, $5)'
  var isbn = req.body.b1
  var title = req.body.b2
  var pubyear = req.body.b3
  var numpages  = req.body.b4
  var pubname = req.body.b5
  var values = [isbn, title, pubyear, numpages, pubname]
  console.log(values)
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
  client.query('SELECT * FROM book WHERE isbn = ($1) ',
    values , (error, res,cols) => {
      if (error) {
        throw error
      }
    var tablebo2 ='';
    for(var i=0; i<res.rowCount; i++){
      tablebo2 += '<tr><td>' + res.rows[i].isbn +'</td><td>'+ res.rows[i].title +'</td><td>'+ res.rows[i].pubyear +'</td><td>'+ res.rows[i].numpages +'</td><td>' + res.rows[i].pubname +'</td></tr>';
    }
    tablebo2 ='<table border="1"><tr><th>ISBN </th><th> Title </th><th>Year of Publishment</th><th>Date of Birth</th><th>Number of Pages</th><th>Publisher</th></tr>'+ tablebo2 +'</table>';
    return cb(tablebo2);  
    })
}
const bookShow2 = (req, res,next)=>{
  var isbn = req.body.b1
  values = [isbn]
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
  var text = 'DELETE FROM  book WHERE isbn = ($1)'
  var deleteISBN= req.body.b6
  var values = [deleteISBN]
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
  var text = 'UPDATE book SET title = ($2) , pubyear = ($3), numpages = ($4), pubname = ($5) WHERE isbn = ($1)'
  var isbn = req.body.b7
  var title = req.body.b8
  var pubyear = req.body.b9
  var numpages  = req.body.b10
  var pubname = req.body.b11
  var values = [isbn, title, pubyear, numpages, pubname]
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
  client.query('SELECT * FROM book WHERE isbn = ($1) ',
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
  var bid = req.body.b7
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
/////////////////////////////////////////////////////////////////////////////////////////////////////
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
//////////////////////////////////////////////
// queries for member table START HERE
// query for showing member entries in first page /member
const SelectMember1 = (cb) => { 
  client.query('SELECT * FROM member ORDER BY memberid ASC', (error, res,cols) => {
    if (error) {
      throw error
    }
    console.log('query')
    var tableme1 ='';
    for(var i=0; i<res.rowCount; i++){
      tableme1 += '<tr><td>' + res.rows[i].memberid +'</td><td>'+ res.rows[i].mfirst +'</td><td>'+ res.rows[i].mlast +'</td><td>'+ res.rows[i].street +'</td><td>' + res.rows[i].snumber +'</td><td>' + res.rows[i].postalcode +'</td><td>' + res.rows[i].mbirthdate +'</td></tr>';
    }
    tableme1 ='<table border="1"><tr><th> Member ID </th><th> First Name </th><th> Last Name </th><th> Street </th><th> Str Number </th><th> Postal Code </th><th> Date of Birth </th></tr>'+ tableme1 +'</table>';
    return cb(tableme1);   
  })
}
const memberShow1 = (req, res,next)=>{
  var me1;
fs.readFile(path.join(__dirname + '/public/member/member.html'), 'utf8', function read(err, data) {
  if (err) {
      throw err;
  } 
  me1 = data;
  SelectMember1(resql=>{
    me1 = me1.replace('{${table}}', resql);
    res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    res.write(me1, 'utf-8');
    res.end();
  })
});
}
// Query for Inserting a new member into the db
const memberInsert =(req, res, next) => {
  var text = 'INSERT INTO member(mfirst, mlast, street, snumber, postalcode, mbirthdate) VALUES($1, $2, $3, $4, $5,$6)'
  var mfirst = req.body.m1
  var mlast = req.body.m2
  var street = req.body.m3
  var snumber  = req.body.m4
  var postalcode = req.body.m5
  var mbirthdate = req.body.m6
  var values = [mfirst, mlast, street, snumber, postalcode, mbirthdate]
  console.log(values)
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
const SelectMember2 = (cb) => { 
  client.query('SELECT * FROM member WHERE mfirst = ($1) AND mlast = ($2) ',
    values , (error, res,cols) => {
      if (error) {
        throw error
      }
    var tableme2 ='';
    for(var i=0; i<res.rowCount; i++){
      tableme2 += '<tr><td>' + res.rows[i].memberid +'</td><td>'+ res.rows[i].mfirst +'</td><td>'+ res.rows[i].mlast +'</td><td>'+ res.rows[i].street +'</td><td>' + res.rows[i].snumber +'</td><td>' + res.rows[i].postalcode +'</td><td>' + res.rows[i].mbirthdate +'</td></tr>';
    }
    tableme2 ='<table border="1"><tr><th> Member ID </th><th> First Name </th><th> Last Name </th><th> Street </th><th> Str Number </th><th> Postal Code </th><th> Date of Birth </th></tr>'+ tableme2 +'</table>';
    return cb(tableme2);  
    })
}
const memberShow2 = (req, res,next)=>{
  var mfirst = req.body.m1
  var mlast = req.body.m2
  values = [mfirst,mlast]
  var me2
  fs.readFile(path.join(__dirname + '/public/member/memberinsertsuccess.html'), 'utf8', function read(err, data) {
  if (err) {
      throw err;
  } 
  me2 = data;
  SelectMember2(resql=>{
    me2 = me2.replace('{${table}}', resql);
    res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    res.write(me2, 'utf-8');
    res.end();
  })
});
}
// Query for deleting member
const memberDelete = (req, res, next) => {
  var text = 'DELETE FROM  member WHERE memberid = ($1)'
  var deleteMID= req.body.m7
  var values = [deleteMID]
  client.query(text, values, (err, res, next) => {
    if (err) {
      console.log(err.stack)
    } else {
    }
    console.log('Deleted successfully!')
  })
  next()
}
const memberShow3 = (req, res,next)=>{
  var me3
  fs.readFile(path.join(__dirname + '/public/member/memberdeletesuccess.html'),
 'utf8', function read(err, data) {
  if (err) {
      throw err;
  } 
  me3 = data;
  res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    res.write(me3, 'utf-8');
    res.end();
  });
}
// Query for updating member
const memberUpdate =(req, res, next) => {
  var text = 'UPDATE member SET mfirst = ($2) , mlast = ($3), street = ($4), snumber = ($5), postalcode = ($6), mbirthdate = ($7) WHERE memberid = ($1)'
  var memberid = req.body.m8
  var mfirst = req.body.m9
  var mlast = req.body.m10
  var street = req.body.m11
  var snumber  = req.body.m12
  var postalcode = req.body.m13
  var mbirthdate = req.body.m14
  var values = [memberid, mfirst, mlast, street, snumber, postalcode, mbirthdate]
  client.query(text, values, (err, res, next) => {
    if (err) {
      console.log(err.stack)
    } else {
    }
    console.log('Updated successfully!')
  })
  next()
}
const SelectMember4 = (cb) => { 
  client.query('SELECT * FROM member WHERE mfirst = ($1) AND mlast = ($2) ',
    values , (error, res,cols) => {
      if (error) {
        throw error
      }
    var tableme4 ='';
    for(var i=0; i<res.rowCount; i++){
      tableme4 += '<tr><td>' + res.rows[i].memberid +'</td><td>'+ res.rows[i].mfirst +'</td><td>'+ res.rows[i].mlast +'</td><td>'+ res.rows[i].street +'</td><td>' + res.rows[i].snumber +'</td><td>' + res.rows[i].postalcode +'</td><td>' + res.rows[i].mbirthdate +'</td></tr>';
    }
    tableme4 ='<table border="1"><tr><th> Member ID </th><th> First Name </th><th> Last Name </th><th> Street </th><th> Str Number </th><th> Postal Code </th><th> Date of Birth </th></tr>'+ tableme4 +'</table>';
    return cb(tableme4);  
    })
}
const memberShow4 = (req, res,next)=>{
  var mfirst = req.body.m9
  var mlast = req.body.m10
  values = [mfirst,mlast]
  var me4
  fs.readFile(path.join(__dirname + '/public/member/memberupdatesuccess.html'), 'utf8', function read(err, data) {
  if (err) {
      throw err;
  } 
  me4 = data;
  SelectMember4(resql=>{
    me4 = me4.replace('{${table}}', resql);
    res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    res.write(me4, 'utf-8');
    res.end();
  })
  });
}
// queries for member table END HERE
/////////////////////////////////////////////////////////////////////////////////////////////////////


  module.exports = {
    bookAuthorShow,
    bookPublisherShow,
    bookPublisherShow2, 
    memberSortShow,
    memberPostalShow, 
    bookCatShow,
    bookCopyShow,

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

    memberShow1,
    memberInsert,
    memberShow2,
    memberDelete,
    memberShow3,
    memberUpdate,
    memberShow4,
}