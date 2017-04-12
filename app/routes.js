
var express = require('express');
var path    = require('path');

// create our router object
var router = express.Router();

// export our router
module.exports = router;

// route for our homepage
router.get('/', function(req, res) {
  res.sendfile('./public/login.html');
});

router.get('/starter', function(req, res) {
  res.sendfile('./public/starter.html');
});

