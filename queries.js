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

//AYTA PAIZEI NA EINAI AXRISTA
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

const memberInsert =(req, res, next) => {
    var text = 'INSERT INTO member(memberid, mfirst, mlast) VALUES($1, $2, $3)'
    var firstName = req.body.n1
    var lastName = req.body.n2
    var memberID = req.body.n3
    const values = [ memberID, firstName, lastName]
    console.log('first name:' + firstName + '   last name:' +  lastName + '   member ID:' + memberID) 
    client.query(text, values, (err, res) => {
      if (err) {
        console.log(err.stack)
      } else {
        console.log('insert success')
      }
    }) 
    client.query('SELECT * FROM member ORDER BY memberid ASC', (error, results) => {
      if (error) {
        throw error
      }
      res.status(200).json(results.rows)
    })
  }

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


  module.exports = {
    memberInsert,
    memberUpdate,
    memberSearch,
  }