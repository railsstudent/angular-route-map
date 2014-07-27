'use strict';

/**
 * @ngdoc directive
 * @name angularBusRouteApp.directive:busRouteDirective
 * @description
 * # busRouteDirective
 */
var app = angular.module('routeMapDirective', []);

app
  .directive('appVersion', ['version', function(version) {
    return function(scope, elm) {
      elm.text(version);
    };
   }])
  .directive('appAuthor', ['author', function(author) {
    return function(scope, elm){
        elm.text(author);
    };
  }]);

