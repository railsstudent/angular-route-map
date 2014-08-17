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
app.controller('RouteCtrl', ['$scope', 'routes', 'title', 'prefix', 
    function ($scope, routes, title, prefix) {

      $scope.title = title;
      $scope.routes = routes;  
      $scope.config = {
          prefix : prefix
      };

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
  .controller('RouteMapCtrl', ['$scope', 'RouteService', 'selectedShift',
      function($scope, RouteService, selectedShift) {

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
          selectedShift : selectedShift,
          selectedRoute : undefined,
          shifts : RouteService.getShifts(),
          routeArray : [],
          disabled : true,
          selectedLatlngs : []
        };
        
        var errorCallback = function _errorCallback(err) {
          console.log(err);
          $scope.dropDownOptions.routeArray = [];
          $scope.dropDownOptions.selectedRoute = undefined;
          $scope.dropDownOptions.selectedLatlngs = [];
          $scope.dropDownOptions.disabled = true;
        };

        var successCallback = function _successCallback(arrNames) {
          var filteredResult = arrNames;

          $scope.dropDownOptions.selectedLatlngs = null;
          $scope.dropDownOptions.disabled = true;                
          if (_.isNull(filteredResult)) {
            filteredResult = [];
          } 
          if (_.isEmpty(filteredResult) === false) {
            var intId = filteredResult[0].id;
            $scope.dropDownOptions.selectedRoute = intId;

            var selectedRoute = null;
            if (_.isEqual($scope.dropDownOptions.selectedShift, 'Day')) {
              selectedRoute = RouteService.getDayLatLngs(intId);
            } else if (_.isEqual($scope.dropDownOptions.selectedShift, 'Night')) {
              selectedRoute = RouteService.getNightLatLngs(intId);              
            }
            if (!_.isNull(selectedRoute)) {
              selectedRoute.then(function(resultRoute){
                $scope.dropDownOptions.selectedLatlngs = resultRoute.stop_name;
                $scope.dropDownOptions.disabled = false;
                calRoute();
              });
            }
          }
          $scope.dropDownOptions.routeArray = filteredResult;
        };

        var getRouteInfo = function(promise) {
          promise.then (successCallback, errorCallback);
        };

        var calRoute = function myCalRoute() {
          // delete route
          directionsDisplay.setMap(null);
          var gmap = $scope.map.control.getGMap();
          if (!_.isNull(gmap)) {
            directionsDisplay.setMap(gmap);

            var selectedLatLngs = $scope.dropDownOptions.selectedLatlngs;
            if (!_.isNull(selectedLatLngs) && !_.isEmpty(selectedLatLngs)) {
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
              }

              var request = {
                  origin: new google.maps.LatLng(first.lat, first.lng),
                  destination: new google.maps.LatLng(last.lat, last.lng),
                  waypoints: waypts,
                  travelMode: google.maps.TravelMode.DRIVING
              };
              directionsService.route(request, function(response, status) {
                if (_.isEqual(status, google.maps.DirectionsStatus.OK)) {
                  directionsDisplay.setDirections(response);
                }
              });
            }
          }
        };

        $scope.chooseRoute = function _chooseRoute(routeId) {
            var selectedRoute = null;
            var intId = _.parseInt(routeId);
            if (_.isEqual($scope.dropDownOptions.selectedShift, 'Day')) {
              selectedRoute = RouteService.getDayLatLngs(intId);
            } else if (_.isEqual($scope.dropDownOptions.selectedShift, 'Night')) {
              selectedRoute = RouteService.getNightLatLngs(intId);              
            }
            if (_.isNull(selectedRoute)) {
              $scope.dropDownOptions.selectedLatlngs = null;
            } else {
              selectedRoute.then(function(resultRoute) {
                $scope.dropDownOptions.selectedLatlngs = resultRoute.stop_name;  
                calRoute();
              });
            }
        };

        $scope.chooseShift = function _chooseShift(val) {

            $scope.dropDownOptions.routeArray = [];
            $scope.dropDownOptions.selectedRoute = undefined;
            $scope.dropDownOptions.disabled = true;
            $scope.dropDownOptions.selectedLatlngs = [];
            directionsDisplay.setMap(null);
            if (_.isEqual('Day', val)) {
              getRouteInfo(RouteService.getDayRouteNames());
            } else if (_.isEqual('Night', val)) {
              getRouteInfo(RouteService.getNightRouteNames());
            } 
          };

        $scope.chooseShift($scope.dropDownOptions.selectedShift);  

      }])
  .controller('CreateRouteCtrl', ['$scope',  
      function($scope) {

        var rendererOptions = {
          suppressMarkers : true,
          draggable: false
        };

        // http://lemonharpy.wordpress.com/2011/12/15/working-around-8-waypoint-limit-in-google-maps-directions-api/
        // JS Fiddle: http://jsfiddle.net/ZyHnk/

        var directionsService = new google.maps.DirectionsService();
        var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
        directionsDisplay.setPanel(document.getElementById('directionsPanel'));
      
        $scope.routes = [];
        $scope.sciencePark =  { 'name' : '10 Science Park W Ave' }; 
        $scope.fullRoutes = [];
        $scope.myMarkers = [];

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

        $scope.options = {
          types : 'geocode', 
          country: 'hk',
          watchEnter : false
        };

        $scope.addRow = function _addRow() {
          $scope.routes.push( { 'name' : '' } );
        };

        $scope.removeRow = function _removeRow(idx) {
            if (_.isEmpty($scope.routes)) {
              return;
            }

            if (_.isEqual(idx, 0)) {
              $scope.routes.shift();
            } else if (_.isEqual(idx, $scope.routes.length - 1)) {
              $scope.routes.pop();
            } else {
              $scope.routes.splice(idx, 1);
            }
        };

        $scope.insertAfterRow = function _insertAfterRow(idx) {
            $scope.routes.splice(idx + 1 , 0, { 'name' : '' });
        };

        var splitBatches =  function _splitBatches() {
          
          $scope.fullRoutes = _.clone($scope.routes, true);
          $scope.fullRoutes.push($scope.sciencePark);

          var batches = [];
          var itemsPerBatch = 10; // google API max = 10 - 1 start, 1 stop, and 8 waypoints
          var itemsCounter = 0;
          var wayptsExist = $scope.fullRoutes.length > 0;

          while (wayptsExist) {
              var subBatch = [];
              var subitemsCounter = 0;

              for (var j = itemsCounter; j < $scope.fullRoutes.length; j++) {
                  subitemsCounter++;
                  subBatch.push({
                      location: $scope.fullRoutes[j].name,
                      stopover: true
                  });
                  if (_.isEqual(subitemsCounter, itemsPerBatch)) {
                      break;
                   }   
              }

              itemsCounter += subitemsCounter;
              batches.push(subBatch);
              wayptsExist = itemsCounter < $scope.fullRoutes.length;
              // If it runs again there are still points. Minus 1 before continuing to 
              // start up with end of previous tour leg
              itemsCounter--;
          }  
          return batches;
        };

        //http://stackoverflow.com/questions/1544739/google-maps-api-v3-how-to-remove-all-markers
        var clearOverlays = function _clearOverlays() {
          _.each($scope.myMarkers, function(m) {
            m.setMap(null);
          });
          $scope.myMarkers = [];  
        };

        var stepDisplay = new google.maps.InfoWindow();
        var createCustomMarker = function _createMarker(position, gmap, number, address_name) {
           
            var icon = 'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=' + number + '|FF0000|000000';
            var marker = new google.maps.Marker({
                                    position: position, 
                                    map: gmap,
                                    icon: icon
                              }); 

            google.maps.event.addListener(marker, 'click', function() {
              // Open an info window when the marker is clicked on,
              // containing the address of the step.
              stepDisplay.setContent(address_name);
              stepDisplay.open(gmap, marker);
            });
           return marker;
        };

        var addCustomMarkers = function _addCustomMarkers(legArray, gmap) {

          clearOverlays();
          if (_.isArray(legArray)) {
              var marker = null;
              var numElement = _.size(legArray);

              // add marker for start
              var firstLeg = _.first(legArray);
              marker = createCustomMarker(firstLeg.start_location, gmap, 1, firstLeg.start_address); 
              $scope.myMarkers.push(marker);    

              if (numElement > 1) {
                _.each(legArray, function(leg, idx) {
                    marker = createCustomMarker(leg.end_location, gmap, idx + 2, leg.end_address); 
                    $scope.myMarkers.push(marker);  
                });
              }

              // add marker for destination
              var lastLeg = _.last(legArray);
              marker = createCustomMarker(lastLeg.end_location, gmap, numElement + 1, lastLeg.end_address);
              $scope.myMarkers.push(marker);  
          }
        };

        // http://googlemaps.googlermania.com/google_maps_api_v3/en/map_example_direction_customicon.html
        // http://lemonharpy.wordpress.com/2011/12/15/working-around-8-waypoint-limit-in-google-maps-directions-api/
        $scope.calRoute = function _calRoute() {

            // delete route
            directionsDisplay.setMap(null);
            var gmap = $scope.map.control.getGMap();
            if (_.isNull(gmap) === false) {
              directionsDisplay.setMap(gmap);

              var batches = splitBatches();
       
              // now we should have a 2 dimensional array with a list of a list of waypoints
              var combinedResults;
              var unsortedResults = [{}]; // to hold the counter and the results themselves as they come back, to later sort
              var directionsResultsReturned = 0;

              for (var k = 0; k < batches.length; k++) {
                  var lastIndex = batches[k].length - 1;
                  var start = batches[k][0].location;
                  var end = batches[k][lastIndex].location;

                  // trim first and last entry from array
                  var waypts = [];
                  waypts = batches[k];
                  waypts.splice(0, 1);
                  waypts.splice(waypts.length - 1, 1);

                  var request = {
                      origin: start,
                      destination: end,
                      waypoints: waypts,
                      travelMode: window.google.maps.TravelMode.DRIVING
                  };
                  
                  directionsService.route(request, function (result, status) {
                    if (_.isEqual(status, window.google.maps.DirectionsStatus.OK)) {

                      var unsortedResult = { order: k, result: result };
                      unsortedResults.push(unsortedResult);
                              
                      directionsResultsReturned++;
                      if (_.isEqual(directionsResultsReturned, batches.length)) {// we've received all the results. put to map
                
                        // sort the returned values into their correct order
                        unsortedResults.sort(function (a, b) { return parseFloat(a.order) - parseFloat(b.order); });
                        var count = 0;
                        for (var key in unsortedResults) {
                            if (_.isObject(unsortedResults[key].result)) {
                                // if (unsortedResults.hasOwnProperty(key)) {
                                if (_.has(unsortedResults, key)) {
                                    if (_.isEqual(count, 0)) { // first results. new up the combinedResults object
                                        combinedResults = unsortedResults[key].result;
                                    } else {
                                        // only building up legs, overview_path, and bounds in my consolidated object. 
                                        // This is not a complete 
                                        // directionResults object, but enough to draw a path on the map, which is all I need
                                        combinedResults.routes[0].legs = combinedResults.routes[0].legs.concat(
                                                                            unsortedResults[key].result.routes[0].legs);
                                        combinedResults.routes[0].overview_path = combinedResults.routes[0].overview_path.concat(
                                                                            unsortedResults[key].result.routes[0].overview_path);
                                        combinedResults.routes[0].bounds = combinedResults.routes[0].bounds.extend(
                                                                              unsortedResults[key].result.routes[0].bounds.getNorthEast());
                                        combinedResults.routes[0].bounds = combinedResults.routes[0].bounds.extend(
                                                                              unsortedResults[key].result.routes[0].bounds.getSouthWest());
                                    }
                                    count++;
                                }
                            }
                        }

                        // add custom marker
                        if (_.isArray(combinedResults.routes)) {
                          if (_.isObject(combinedResults.routes[0])) { 
                            addCustomMarkers(combinedResults.routes[0].legs, gmap);
                          }
                        }

                        directionsDisplay.setDirections(combinedResults);
                      }
                    }
                });  // directionsService.route
              } // for k
            }  // end if
        };  // end of calRoute function
      }]);
