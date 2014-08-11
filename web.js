var express = require("express");
var logfmt = require("logfmt");
var fs = require('fs');
var app = express();

app.use(logfmt.requestLogger());

// API Documentation: http://expressjs.com/4x/api.html#router
// http://scotch.io/tutorials/javascript/learn-to-use-the-new-router-in-expressjs-4
// http://scotch.io/tutorials/javascript/build-a-restful-api-using-node-and-express-4
// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); 				// get an instance of the express Router

// always invoked
// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	// console.log('Something is happening.');
	console.log('%s %s %s', req.method, req.url, req.path);
	next(); // make sure we go to the next routes and don't stop here
});

router.route('/api/v1/route/morning')
	// get all the morning routes (accessed at GET http://localhost:8080/api/v1/route/morning)
	.get(function(req, res) {
		var file = __dirname + '/app/api/v1/morning_routes.json';
		fs.readFile(file, 'utf8', function (err, data) {
			if (err) {
				console.log('Error: ' + err);
			    return;
			}
  			data = JSON.parse(data);
  			res.send(data);
		});
	});

// get all the evening routes (accessed at GET http://localhost:5000/api/v1/route/evening)
router.route('/api/v1/route/evening')
	.get(function(req, res) {
		var file = __dirname + '/app/api/v1/evening_routes.json';
		fs.readFile(file, 'utf8', function (err, data) {
			if (err) {
				console.log('Error: ' + err);
			    return;
			}
  			data = JSON.parse(data);
			res.send(data);
		});
	});

// home page route (http://localhost:5000)
router.get('/', function(req, res) {
	res.sendfile('./app/index.html');
});

// http://stackoverflow.com/questions/23860275/javascript-angular-not-loading-when-using-express
//add this so the browser can GET the bower files
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/app'));

// http://stackoverflow.com/questions/19687667/making-ajax-call-angular-to-node-js-express-js
var allowCrossDomain = function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'content-type, Authorization, Content-Length, X-Requested-With, Origin, Accept');

	if ('OPTIONS' === req.method) {
	    res.send(200);
	} else {
	    next();
	}
};

app.use(allowCrossDomain);

// apply the routes to our application
app.use('/', router);

// Error-handling middleware 
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.send(500, 'Something broke!');
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});
