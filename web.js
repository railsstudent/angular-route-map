'use strict';

var compression = require('compression');
var express = require("express");
var logfmt = require("logfmt");
var app = express();
var router = require('./routeApi');   // move routes to routeApi.js

app.use(logfmt.requestLogger());
app.use(compression());

var home = express.Router(); 
home.get("/", function (req, res) {
	res.sendfile('index.html');
});

// http://stackoverflow.com/questions/23860275/javascript-angular-not-loading-when-using-express
//add this so the browser can GET the bower files
app.use(express.static(__dirname + '/dist'));

// apply the routes to our application
// app.use('/', router);
app.use('/api/v1', router);
app.use('/', home);

// Error-handling middleware 
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.send(500, 'Something broke!'  + err.message);
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});
