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
app.controller('RouteCtrl', ['$scope', 'routes', 'title',
    function ($scope, routes, title) {

      $scope.title = title;
      $scope.routes = routes;  
    }])
  .controller('MainCtrl', ['$scope',  '$location', '$anchorScroll',
    function($scope, $location, $anchorScroll) {
      
      $scope.scrollToElement = function(elemId) {
          // set the location.hash to the id of
          // the element you wish to scroll to.
          $location.hash(elemId);

          // call $anchorScroll()
          $anchorScroll();
      }
  }])
  .controller('RouteMapCtrl', ['$scope', 
      function($scope) {

      }]);
