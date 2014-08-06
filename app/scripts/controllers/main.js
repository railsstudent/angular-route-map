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

      $scope.showButton = [];
      _(routes.length).times(function(n) { $scope.showButton.push( { text: 'Show', collapse: true } ); });

      $scope.setShowButtonText = function(rowIdx) {
        if (_.isEqual($scope.showButton[rowIdx].text, 'Show')) {
           $scope.showButton[rowIdx].text = 'Hide';
        } else {
            $scope.showButton[rowIdx].text = 'Show';
        }
        $scope.showButton[rowIdx].collapse = !$scope.showButton[rowIdx].collapse;
      };  
    }])
  .controller('MainCtrl', ['$scope',  '$location', '$anchorScroll',
    function($scope, $location, $anchorScroll) {
      
      $scope.scrollToElement = function(elemId) {
          // set the location.hash to the id of
          // the element you wish to scroll to.
          $location.hash(elemId);

          // call $anchorScroll()
          $anchorScroll();
      };
  }])
  .controller('RouteMapCtrl', ['$scope', 'RouteService', 
      function($scope, RouteService) {

// https://github.com/nlaplante/angular-google-maps/blob/master/example/assets/scripts/controllers/example.js
        var directionsService = new google.maps.DirectionsService();
        var directionsDisplay = new google.maps.DirectionsRenderer();

        $scope.map = {
            center: {
                latitude: 22.3910, 
                longitude: 114.0878
            },
            zoom: 8,
            control: {}
        };

        $scope.getMapInstance = function () {
          return $scope.map.control.getGMap();
        }

        $scope.routeDropDownOptions ={
          selected_shift: undefined,
          selected_route : undefined,
          shifts : RouteService.getShifts(),
          routeArray : [],
          disabled : true,
          selected_latlngs : []
        };
        
        var error_callback = function(err) {
          console.log(err);
          $scope.routeDropDownOptions.routeArray = [];
          $scope.routeDropDownOptions.selected_route = undefined;
          $scope.routeDropDownOptions.selected_latlngs = [];
          $scope.routeDropDownOptions.disabled = true;
        };

        var getRouteInfo = function(promise) {
          promise.then (function (arrLatLng) {
            var filteredResult = arrLatLng;
            if (_.isNull(filteredResult)) {
              filteredResult = [];
              $scope.routeDropDownOptions.disabled = true;
            } 
            if (_.isEmpty(filteredResult) === false) {
              $scope.routeDropDownOptions.selected_route = filteredResult[0].id;

              var selected_route = _.find(filteredResult, function(route) {
                return route.id ==  filteredResult[0].id;
              });
              $scope.routeDropDownOptions.selected_latlngs = selected_route.stop_name;
             $scope.routeDropDownOptions.disabled = false;
            }
            $scope.routeDropDownOptions.routeArray = filteredResult;
          }, error_callback);
        };

        var calRoute = function() {
          // delete route
          directionsDisplay.setMap(null);
          if ($scope.routeDropDownOptions.selected_route) {

          }
        };

        $scope.chooseRoute = function _chooseRoute(route_id) {
          var tmp_routes = $scope.routeDropDownOptions.routeArray;
          var selected_route = 
            _.find(tmp_routes, function(route) {
                return route.id ==  route_id;
            });
          $scope.routeDropDownOptions.selected_latlngs = selected_route.stop_name;  
        }

        $scope.chooseShift = function _chooseShift(val) {

            if (_.isEqual('Day', val)) {
              getRouteInfo(RouteService.getDayLatLngs());
            } else if (_.isEqual('Night', val)) {
              getRouteInfo(RouteService.getNightLatLngs());
            } else {
              $scope.routeDropDownOptions.routeArray = [];
              $scope.routeDropDownOptions.selected_route = undefined;
              $scope.routeDropDownOptions.disabled = true;
              $scope.routeDropDownOptions.selected_latlngs = [];
              directionsDisplay.setMap(null);
            }
          };
      }]);
