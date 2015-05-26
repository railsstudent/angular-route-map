'use strict';

var compression = require('compression');
var express = require("express");
var logfmt = require("logfmt");
var app = express();
var timeout = require('connect-timeout');
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
app.use('/api/v1', router)
	.use('/api/v1', timeout(5000))
	.use(haltOnTimeout);
app.use('/', home);
// according to beginning nodejs, add timeout middleware and halt on timeout function

// Error-handling middleware 
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.send(500, 'Something broke!'  + err.message);
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});

function haltOnTimeout(req, res, next) {
	if (!req.timeout) {
		next();
	}
}

