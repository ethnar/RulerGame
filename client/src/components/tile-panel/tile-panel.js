angular.module('RulerGame')

.directive('tilePanel', function (cityService) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            tile: '=',
            mode: '='
        },
        templateUrl: 'components/tile-panel/tile-panel.html',
        controller: function ($scope) {
            $scope.availableBuildings = cityService.getAvailableBuildings();

            $scope.recruitWorker = () => {
                cityService.recruitWorker();
            };

            $scope.recruitWarrior = () => {
                cityService.recruitWarrior();
            };

            $scope.orderMove = () => {
                $scope.mode = 'move';
            };

            $scope.orderBuild = (building) => {
                cityService.orderBuild($scope.tile, building);
            };
        }
    }
});
