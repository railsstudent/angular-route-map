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
    'restangular',
    'google-maps'
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
                    return Restangular.all('route/morning').getList().then(
                      function(data) {
                        return data;
                      }, 
                      function(err) {
                        console.log(err);
                        return [];
                      });
                    }],
                    title: [ function() { return 'Day Routes'; } ]
                },
              controller: 'RouteCtrl'
            })
        .state('evening_route', 
          { 
            url: '/evening_route',
            templateUrl: 'views/route.html',
            resolve: { 
                  routes:  ['Restangular', function(Restangular) {
                    return Restangular.all('route/evening').getList().then(
                      function(data) {
                        return data;
                      }, 
                      function(err) {
                        console.log(err);
                        return [];
                      });
                    }],
                    title: [ function() { return 'Night Routes'; } ]
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
             // if (_.isEqual(what, 'evening_routes.json') || 
             //         _.isEqual(what, 'morning_routes.json')) {
             //   extractedData = data.routes;
             // }
            if (_.isEqual(what, 'route/evening') || 
                      _.isEqual(what, 'route/morning')) {
                extractedData = data.routes;
            }
          }
          return extractedData;
    });

  }]);

   


 