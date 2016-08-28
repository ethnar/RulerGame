angular.module('RulerGame', ['ngRoute', 'ngWebSocket'])

.config(function ($routeProvider) {
    $routeProvider
        .when('/map', {
            templateUrl: 'views/map/map.html',
            controller: 'mapController'
        });
})

.controller('RulerGameController', function ($scope, $route, serverService) {
    $scope.model = {};

    serverService.request('authenticate', {
        password: 'abc'
    });
});
