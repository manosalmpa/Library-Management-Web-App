var express = require('express');
var router = express.Router();
const client=require('../app').client;
/* GET home page. */



router.get('/', function(req, res, next) {
  console.log("inside get")
  const members=client.query("select * from member");
  res.send(members);
  //res.render('index', { title: 'LibraryNTUA' });
  
});

module.exports = router;
