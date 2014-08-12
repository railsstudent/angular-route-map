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
          $anchorScroll();
      };
  }])
  .controller('RouteMapCtrl', ['$scope', 'RouteService', 
      function($scope, RouteService) {

// https://github.com/angular-ui/angular-google-maps/blob/master/example/example.html
// https://github.com/nlaplante/angular-google-maps/blob/master/example/assets/scripts/controllers/example.js

        var rendererOptions = {
          draggable: true
        };

        var directionsService = new google.maps.DirectionsService();
        var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
        directionsDisplay.setPanel(document.getElementById('directionsPanel'));
      
        $scope.map = {
            center: {
                latitude: 22.3910, 
                longitude: 114.0878
            },
            zoom: 12,
            control: {},
            options: {
              disableDefaultUI: false
            }
        };

        $scope.dropDownOptions ={
          selectedShift: undefined,
          selectedRoute : undefined,
          shifts : RouteService.getShifts(),
          routeArray : [],
          disabled : true,
          selected_latlngs : []
        };
        
        var error_callback = function errorCallback(err) {
          console.log(err);
          $scope.dropDownOptions.routeArray = [];
          $scope.dropDownOptions.selectedRoute = undefined;
          $scope.dropDownOptions.selected_latlngs = [];
          $scope.dropDownOptions.disabled = true;
        };

        var success_callback = function successCallback(arrNames) {
          var filteredResult = arrNames;

          $scope.dropDownOptions.selected_latlngs = null;
          $scope.dropDownOptions.disabled = true;                
          if (_.isNull(filteredResult)) {
            filteredResult = [];
          } 
          if (_.isEmpty(filteredResult) === false) {
            var intId = filteredResult[0].id;
            $scope.dropDownOptions.selectedRoute = intId;

            var selected_route = undefined;
            if (_.isEqual($scope.dropDownOptions.selectedShift, 'Day')) {
              selected_route = RouteService.getDayLatLngs(intId);
            } else if (_.isEqual($scope.dropDownOptions.selectedShift, 'Night')) {
              selected_route = RouteService.getNightLatLngs(intId);              
            }
            if (!_.isNull(selected_route)) {
              selected_route.then(function(resultRoute){
                $scope.dropDownOptions.selected_latlngs = resultRoute.stop_name;
                $scope.dropDownOptions.disabled = false;
                calRoute();
              });
            }
          }
          $scope.dropDownOptions.routeArray = filteredResult;
        };

        var getRouteInfo = function(promise) {
          promise.then (success_callback, error_callback);
        };

        var calRoute = function myCalRoute() {
          // delete route
          directionsDisplay.setMap(null);
          var gmap = $scope.map.control.getGMap()
          if (_.isNull(gmap) === false) {
            directionsDisplay.setMap(gmap);

            var selectedLatLngs = $scope.dropDownOptions.selected_latlngs;
            if (_.isNull(selectedLatLngs) === false 
                && _.isEmpty(selectedLatLngs) === false) {
              var first = _.first(selectedLatLngs);
              var last = _.last(selectedLatLngs);
              var size = _.size(selectedLatLngs);
              var waypts = [];

              if (size > 2) {
                _.forEach(selectedLatLngs, function(obj, index) {
                  if (index >= 1 && index < size - 1) {
                    waypts.push(
                      { 
                        location : new google.maps.LatLng(obj.lat, obj.lng), 
                        stopover : true 
                      });
                  }
                }, waypts);
              };

              var request = {
                  origin: new google.maps.LatLng(first.lat, first.lng),
                  destination: new google.maps.LatLng(last.lat, last.lng),
                  waypoints: waypts,
                  travelMode: google.maps.TravelMode.DRIVING
              };
              directionsService.route(request, function(response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                  directionsDisplay.setDirections(response);
                }
              });
            }
          }
        };

        $scope.chooseRoute = function _chooseRoute(route_id) {
            var selected_route = undefined;
            var intId = _.parseInt(route_id);
            if (_.isEqual($scope.dropDownOptions.selectedShift, 'Day')) {
              selected_route = RouteService.getDayLatLngs(intId);
            } else if (_.isEqual($scope.dropDownOptions.selectedShift, 'Night')) {
              selected_route = RouteService.getNightLatLngs(intId);              
            }
            if (_.isNull(selected_route)) {
              $scope.dropDownOptions.selected_latlngs = null;
            } else {
              selected_route.then(function(resultRoute) {
                $scope.dropDownOptions.selected_latlngs = resultRoute.stop_name;  
                calRoute();
              });
            }
        };

        $scope.chooseShift = function _chooseShift(val) {

            $scope.dropDownOptions.routeArray = [];
            $scope.dropDownOptions.selectedRoute = undefined;
            $scope.dropDownOptions.disabled = true;
            $scope.dropDownOptions.selected_latlngs = [];
            directionsDisplay.setMap(null);
            if (_.isEqual('Day', val)) {
              getRouteInfo(RouteService.getDayRouteNames());
            } else if (_.isEqual('Night', val)) {
              getRouteInfo(RouteService.getNightRouteNames());
            } 
          };
      }]);
