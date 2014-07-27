'use strict';

/**
 * @ngdoc function
 * @name angularRouteMapApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularRouteMapApp
 */

var app = angular.module('routeMapController', []);


app.controller('MainCtrl', ['$scope', function ($scope) {
    $scope.morningRoutes = [
      'Kowloon East (Science Park -> Kwun Tong -> Tseung Keung O',
      'Hong Kong East',
      'Hong Kong West'
    ];

    $scope.eveningRoutes = [ '1', '2', '3', '4'];
  }])
	.controller('RouteCtrl', ['$scope', function ($scope) {

  	$scope.stuff = {

  		a : 'a',
  		b : 'b'
  	};
   
  }]);;
