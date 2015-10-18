
var express = require("express");
var fs = require('fs');


// API Documentation: http://expressjs.com/4x/api.html#router
// http://scotch.io/tutorials/javascript/learn-to-use-the-new-router-in-expressjs-4
// http://scotch.io/tutorials/javascript/build-a-restful-api-using-node-and-express-4
// ROUTES FOR OUR API
// =============================================================================
// http://codereview.stackexchange.com/questions/51614/exporting-routes-in-node-js-express-4
module.exports = (function () {
	'use strict';
	var router = express.Router();

	router.use(function(req, res, next) {
		// do logging
		console.log('%s %s %s', req.method, req.url, req.path);
		next(); // make sure we go to the next routes and don't stop here
	});


	var sendJson = function _readFile(filename, req, res) {
		fs.readFile(filename, 'utf8', function (err, data) {
			if (err) {
				console.log('Error: ' + err);
			    return;
			}
			var jsondata = JSON.parse(data);
			res.send(jsondata);
		});
	};

	var sendOneRoute = function _readFile(filename, req, res) {
		fs.readFile(filename, 'utf8', function (err, data) {
			if (err) {
				console.log('Error: ' + err);
			    return;
			}
			var jsonData = JSON.parse(data);
			var routes = jsonData.routes;
			var arr = undefined;
			var intId = parseInt(req.params.id);
			for (var i = 0; i < routes.length; i++) {
				if (routes[i].id === intId) {
					arr = routes[i];
				}
			}
			res.send(arr);
		});
	};

	router.route('/route/morning')
		// get all the morning routes (accessed at GET http://localhost:5000/api/v1/route/morning)
		.get(function(req, res) {
			var file = __dirname + '/dist/api/v1/morning_routes.json';
			sendJson(file, req, res);
		});

	router.route('/route/morning/:id.json')
		// get all the morning routes (accessed at
		// GET http://localhost:5000/api/v1/route/morning/:id)
		.get(function(req, res) {
			var file = __dirname + '/dist/api/v1/morning_routes.json';
			sendOneRoute(file, req, res);
		});

	router.route('/route/names/:shift')
		// get all the morning routes 
		// (accessed at GET http://localhost:5000/api/v1/route/names/:shift)
		.get(function(req, res) {

			var file = __dirname + '/dist/api/v1/' + req.params.shift + '_routes.json';
			fs.readFile(file, 'utf8', function (err, data) {
				if (err) {
					console.log('Error: ' + err);
				    return;
				}
	  			var data = JSON.parse(data);
	  			var routes = data.routes;
	  			var arr = [];
	  			for (var i = 0; i < routes.length; i++) {
	  				arr.push({"id" : routes[i].id, "name" : routes[i].name});
	  			}
				res.send({ "routes" : arr });
			});
		});

	// get all the evening routes (accessed at GET http://localhost:5000/api/v1/route/evening)
	router.route('/route/evening')
		.get(function(req, res) {
			var file = __dirname + '/dist/api/v1/evening_routes.json';
			sendJson(file, req, res);
		});

	router.route('/route/evening/:id.json')
		.get(function(req, res) {
			var file = __dirname + '/dist/api/v1/evening_routes.json';
			sendOneRoute(file, req, res);
		});

	router.route('/route/meeting')
		// get all the morning routes (accessed at GET http://localhost:5000/api/v1/route/meeting)
		.get(function(req, res) {
			var file = __dirname + '/dist/api/v1/meeting_routes.json';
			sendJson(file, req, res);
	});

	router.route('/route/meeting/:id.json')
		.get(function(req, res) {
			var file = __dirname + '/dist/api/v1/meeting_routes.json';
			sendOneRoute(file, req, res);
		});

	router.route('/route/*')
			.all(function(req, res) {
				res.send(501, 'Not Implemented');
			});

	return router;
})();