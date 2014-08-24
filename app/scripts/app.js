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
    'google-maps',
    'ngAutocomplete'
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
                    title: [ function() { return 'Day Routes'; } ],
                    prefix : [ function() { return 'morning'; } ]
                },
              controller: 'RouteCtrl'
            })
// http://stackoverflow.com/questions/20866931/ui-router-nested-route-controller-isnt-being-called
        .state('morning_route_map', 
          { 
            url: '/morning/route_map',
            templateUrl: 'views/route_map.html',
            controller: 'RouteMapCtrl',
            resolve : { 
              selectedShift : [ function() { return 'Day'; } ]
            }
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
                    title : [ function() { return 'Night Routes'; } ],
                    prefix : [ function() { return 'evening'; } ]
                },
            controller: 'RouteCtrl'
          })
// http://stackoverflow.com/questions/20866931/ui-router-nested-route-controller-isnt-being-called
         .state('evening_route_map', 
          { 
            url: '/evening/route_map',
            templateUrl: 'views/route_map.html',
            controller: 'RouteMapCtrl',
            resolve : { 
              selectedShift : [ function() { return 'Night'; } ]
            }
          })
          .state('meeting_route', 
            { 
              url: '/meeting_route',
              templateUrl: 'views/route.html',
              resolve: { 
                  routes:  ['Restangular', function(Restangular) {
                    return Restangular.all('route/meeting').getList().then(
                      function(data) {
                        return data;
                      }, 
                      function(err) {
                        console.log(err);
                        return [];
                      });
                    }],
                    title: [ function() { return 'Meeting Routes'; } ],
                    prefix : [ function() { return 'meeting'; } ]
                },
              controller: 'RouteCtrl'
            })
// http://stackoverflow.com/questions/20866931/ui-router-nested-route-controller-isnt-being-called
        .state('meeting_route_map', 
          { 
            url: '/meeting/route_map',
            templateUrl: 'views/route_map.html',
            controller: 'RouteMapCtrl',
            resolve : { 
              selectedShift : [ function() { return 'Meeting'; } ]
            }
          })
        .state('create_route', 
          { 
            url: '/create_route',
            templateUrl: 'views/create_route.html',
            controller: 'CreateRouteCtrl'
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
            if (_.isEqual(what, 'route/evening') || 
                _.isEqual(what, 'route/morning') ||
                _.isEqual(what, 'route/names/morning') ||
                _.isEqual(what, 'route/names/evening') ||
                _.isEqual(what, 'route/meeting') ||
                _.isEqual(what, 'route/names/meeting')) {
                extractedData = data.routes;
            }
          }
          return extractedData;
    });

  }]);

   


 