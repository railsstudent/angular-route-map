'use strict';

/**
 * @ngdoc service
 * @name angularBusRouteApp.busrouteServices
 * @description
 * # busrouteServices
 * Service in the angularBusRouteApp.
 */
 // http://www.ng-newsletter.com/posts/restangular.html
var app = angular.module('routeMapServices', []);
app
  .value('version', '0.0.1')
  .value('author', 'Connie Leung')
  .factory('RouteService', [ 'Restangular', 
  	function(Restangular) {
  		return {
  			getShifts : function() { return [ 'Day', 'Night']; },

  			// return a promise
  			getDayLatLngs : function() {
  								return Restangular.all('route_latlng.json').getList();
  							},

  			// return a promise
  			getNightLatLngs : function() {
  								return Restangular.all('route_latlng.json').getList();
  							  } 
  		};
  }]);
