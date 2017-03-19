// apparently node requires create a singleton instance, so having multiple requires is not a problem
var express = require('express');

var router = express.Router();

router.post('/', function(req, res) {
    // login code goes here i guess
});

module.exports = router;