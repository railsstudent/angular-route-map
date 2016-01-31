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
  .value('version', '0.0.9')
  .value('author', 'Connie Leung')
  .factory('RouteService', function(Restangular) {
  		return {
  			getShifts : function _getShifts() { return [ 'Day', 'Night', 'Meeting']; },

  			// return a promise
  			getDayLatLngs : function _getDayLatLngs(id) {
  				return Restangular.all('route/morning').get(id + '.json');
  			},

        getDayRouteNames : function _getDayRouteNames() {
          return Restangular.all('route/names/morning').getList();
        },

  			// return a promise
  			getNightLatLngs : function _getNightLatLngs(id) {
  				return Restangular.all('route/evening').get(id + '.json');
  			},

        getNightRouteNames : function _getNightRouteNames() {
          return Restangular.all('route/names/evening').getList();
        },

        // return a promise
        getMeetingLatLngs : function _getMeetingLatLngs(id) {
          return Restangular.all('route/meeting').get(id + '.json');
        },

        getMeetingRouteNames : function _getMeetingRouteNames() {
          return Restangular.all('route/names/meeting').getList();
        },

  		};
  });
