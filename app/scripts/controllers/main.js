'use strict';

/**
 * @ngdoc function
 * @name angularRouteMapApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularRouteMapApp
 */

var app = angular.module('routeMapController', []);

/* https://github.com/mgonto/restangular#my-response-is-actually-wrapped-with-some-metadata-how-do-i-get-the-data-in-that-case */
/* http://stackoverflow.com/questions/22012655/restangular-getlist-with-object-containing-embedded-array */
/* http://www.ng-newsletter.com/posts/restangular.html */
app.controller('MorningRouteCtrl', ['$scope', 'Restangular', 
    function ($scope, Restangular) {

      $scope.title = 'Morning Routes';
    	Restangular.all('morning_routes.json').getList().then(
        function(data) {
          if (data) {
            $scope.routes = data;
          }
        }, function(err) {
          console.log(err);
          $scope.routes = [];
        });
    
    }])
    .controller('EveningRouteCtrl', ['$scope', 'Restangular', 
      function ($scope, Restangular) {

        $scope.title = 'Evening Routes';

        Restangular.all('evening_routes.json').getList().then(
          function(data) {
             $scope.routes = data; 
          }, function(err) {
            console.log(err);
           $scope.routes = [];   
          });
    }]);
