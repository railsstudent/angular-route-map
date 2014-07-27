'use strict';

/**
 * @ngdoc service
 * @name angularBusRouteApp.busrouteServices
 * @description
 * # busrouteServices
 * Service in the angularBusRouteApp.
 */
var app = angular.module('routeMapServices', []);
app
  .value('version', '0.1')
  .value('author', 'Connie Leung')
  .service('Busrouteservices', function Busrouteservices() {
    // AngularJS will instantiate a singleton by calling "new" on this function
  });
