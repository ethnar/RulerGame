angular.module('RulerGame')

.directive('cityStatus', function (cityService) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'components/city-status/city-status.html',
        controller: function ($scope) {
            $scope.data = cityService.data;
        }
    }
});
