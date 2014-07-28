'use strict';

/**
 * @ngdoc overview
 * @name angularRouteMapApp
 * @description
 * # angularRouteMapApp
 *
 * Main module of the application.
 */
 var app = angular
  .module('angularRouteMapApp', [
    'routeMapServices',
    'routeMapDirective',
    'routeMapController',
    'ngCookies',
    'ngSanitize',
    'ui.router',
    'ui.bootstrap',
    'leaflet-directive',
    'restangular'
  ]);


  app.config(['$stateProvider', '$urlRouterProvider', 
    function ($stateProvider, $urlRouterProvider) {

      /////////////////////////////
      // Redirects and Otherwise //
      /////////////////////////////
      $urlRouterProvider.otherwise('/main');

      // state provider
      $stateProvider
        .state('main', 
            { 
              url: '/main',
              templateUrl: 'views/main.html',
              controller: 'MainCtrl'
            })
         .state('morning_route', 
            { 
              url: '/morning_route',
              templateUrl: 'views/route.html',
              resolve: { 
                  routes:  ['Restangular', function(Restangular) {
                    return Restangular.all('morning_routes.json').getList().then(
                      function(data) {
                        return data;
                      }, 
                      function(err) {
                        console.log(err);
                        return [];
                      });
                    }],
                    title: [ function() { return 'Moring Routes'; } ]
                },
              controller: 'RouteCtrl'
            })
        .state('evening_route', 
          { 
            url: '/evening_route',
            templateUrl: 'views/route.html',
            resolve: { 
                  routes:  ['Restangular', function(Restangular) {
                    return Restangular.all('evening_routes.json').getList().then(
                      function(data) {
                        return data;
                      }, 
                      function(err) {
                        console.log(err);
                        return [];
                      });
                    }],
                    title: [ function() { return 'Evening Routes'; } ]
                },
            controller: 'RouteCtrl'
          })
        .state('route_map', 
          { 
            url: '/route_map',
            templateUrl: 'views/route_map.html',
            controller: 'RouteMapCtrl'
          });
    }]);

/* https://github.com/mgonto/restangular#my-response-is-actually-wrapped-with-some-metadata-how-do-i-get-the-data-in-that-case */
  app.config (['RestangularProvider', function(RestangularProvider) {
      RestangularProvider.setBaseUrl('/api/v1');

      // add a response intereceptor
      RestangularProvider.addResponseInterceptor(
        function(data, operation, what, url, response, deferred) {
          var extractedData = data;
          // .. to look for getList operations
          if (operation === 'getList') {
            // .. and handle the data and meta data
            extractedData = data.routes;
          } 
          return extractedData;
    });
  }]); 


