var express = require('express');
var router = express.Router();
ss
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Library' });
});

module.exports = router;
