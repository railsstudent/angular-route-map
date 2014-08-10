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
      _(routes.length).times(function() { $scope.showButton.push( { text: 'Show', collapse: true } ); });

      $scope.setShowButtonText = function(rowIdx) {
        if (_.isEqual($scope.showButton[rowIdx].text, 'Show')) {
           $scope.showButton[rowIdx].text = 'Collapse';
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

// https://github.com/angular-ui/angular-google-maps/blob/master/example/example.html
// https://github.com/nlaplante/angular-google-maps/blob/master/example/assets/scripts/controllers/example.js
        var directionsService = new google.maps.DirectionsService();
        var directionsDisplay = new google.maps.DirectionsRenderer();

        $scope.map = {
            center: {
                latitude: 22.3910, 
                longitude: 114.0878
            },
            zoom: 14,
            control: {},
            options: {
              disableDefaultUI: false
            }
        };

        $scope.routeDropDownOptions ={
          selectedShift: undefined,
          selectedRoute : undefined,
          shifts : RouteService.getShifts(),
          routeArray : [],
          disabled : true,
          selected_latlngs : []
        };
        
        var error_callback = function(err) {
          console.log(err);
          $scope.routeDropDownOptions.routeArray = [];
          $scope.routeDropDownOptions.selectedRoute = undefined;
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
              $scope.routeDropDownOptions.selectedRoute = filteredResult[0].id;

              var selected_route = _.find(filteredResult, function(route) {
                return _.isEqual(route.id, filteredResult[0].id);
              });

              if (_.isNull(selected_route)) {
                $scope.routeDropDownOptions.selected_latlngs = null;
                $scope.routeDropDownOptions.disabled = true;                
              } else {
                $scope.routeDropDownOptions.selected_latlngs = selected_route.stop_name;
                $scope.routeDropDownOptions.disabled = false;
              }
              calRoute();
            }
            $scope.routeDropDownOptions.routeArray = filteredResult;
          }, error_callback);
        };

        var calRoute = function() {
          // delete route
          directionsDisplay.setMap(null);
          directionsDisplay.setMap($scope.map.control.getGMap());

          if (_.isNull($scope.routeDropDownOptions.selected_latlngs) === false) {
            var first = _.first($scope.routeDropDownOptions.selected_latlngs);
            var last = _.last($scope.routeDropDownOptions.selected_latlngs);
            var waypts = [];
            var size = _.size($scope.routeDropDownOptions.selected_latlngs);
            if (size > 2) {
              for (var i = 1; i < size - 1; i++) {
                  var temp = $scope.routeDropDownOptions.selected_latlngs[i];
                  waypts.push( { 
                                  location : new google.maps.LatLng(temp.lat, temp.lng), 
                                   stopover : true 
                                });
              }
            }

            var start = new google.maps.LatLng(first.lat, first.lng);
            var end = new google.maps.LatLng(last.lat, last.lng);
            var request = {
                origin:start,
                destination:end,
                waypoints: waypts,
                travelMode: google.maps.TravelMode.DRIVING
            };
            directionsService.route(request, function(response, status) {
              if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
              }
            });
          }
        };

        $scope.chooseRoute = function _chooseRoute(route_id) {
          var tmp_routes = $scope.routeDropDownOptions.routeArray;
          var selected_route = 
            _.find(tmp_routes, function(route) {
                return _.isEqual(route.id, _.parseInt(route_id));
            });
          if (_.isNull(selected_route)) {
            $scope.routeDropDownOptions.selected_latlngs = null;
          } else {
            $scope.routeDropDownOptions.selected_latlngs = selected_route.stop_name;  
            calRoute();
          }
        };

        $scope.chooseShift = function _chooseShift(val) {

            if (_.isEqual('Day', val)) {
              getRouteInfo(RouteService.getDayLatLngs());
            } else if (_.isEqual('Night', val)) {
              getRouteInfo(RouteService.getNightLatLngs());
            } else {
              $scope.routeDropDownOptions.routeArray = [];
              $scope.routeDropDownOptions.selectedRoute = undefined;
              $scope.routeDropDownOptions.disabled = true;
              $scope.routeDropDownOptions.selected_latlngs = [];
              directionsDisplay.setMap(null);
            }
          };
      }]);
