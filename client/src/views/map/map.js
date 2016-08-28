angular.module('RulerGame')

.controller('mapController', function ($scope, mapService) {
    $scope.data = mapService.data;
});
