var express = require('express');
var path = require('path');
//var sanitizer = require('sanitizer');

var port = 8080;

var app = express();

app.get('/', function(req, res) {
    res.send("Hello World");
});

app.listen(port, function(event) {
    console.log("Server running");
});