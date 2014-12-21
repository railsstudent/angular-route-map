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
  .value('version', '0.0.3')
  .value('author', 'Connie Leung')
  .factory('RouteService', [ 'Restangular', 
  	function(Restangular) {
  		return {
  			getShifts : function() { return [ 'Day', 'Night', 'Meeting']; },

  			// return a promise
  			getDayLatLngs : function(id) {
  				return Restangular.all('route/morning').get(id);
  			},

        getDayRouteNames : function() {
          return Restangular.all('route/names/morning').getList();
        },

  			// return a promise
  			getNightLatLngs : function(id) {
  				return Restangular.all('route/evening').get(id);
  			},

        getNightRouteNames : function() {
          return Restangular.all('route/names/evening').getList();
        }, 

        // return a promise
        getMeetingLatLngs : function(id) {
          return Restangular.all('route/meeting').get(id);
        },

        getMeetingRouteNames : function() {
          return Restangular.all('route/names/meeting').getList();
        }, 

  		};
  }]);
