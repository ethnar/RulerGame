angular.module('RulerGame')

.controller('mapController', function ($scope, mapService) {
    $scope.model = {};
    $scope.data = mapService.data;

    $scope.getArmyClass = army => {
        var classes = [army.standing];
        if (army.battles.length) {
            classes.push('battling');
        }
        return classes.join(' ');
    };

    let movingClassMap = {
        '0-1': 'north',
        '01': 'south',
        '10': 'neast',
        '11': 'seast',
        '-10': 'nwest',
        '-11': 'swest'
    };
    $scope.getMovingClass = tile => {
        if (tile.army.moving) {
            let targetTile = tile.army.moving.tiles[0];
            let [dx, dy] = [targetTile.x - tile.x, targetTile.y - tile.y];
            let worldSize = Math.max(Math.abs(dx), Math.abs(dy)) + 1; // TODO cheating!
            if (Math.abs(dx) > 1) {
                dx += -worldSize * (dx / Math.abs(dx));
            }
            if (Math.abs(dy) > 1) {
                dy += -worldSize * (dy / Math.abs(dy));
            }
            if (dx != 0) {
                dy += tile.x % 2;
            }
            return movingClassMap['' + dx + dy];
        } else {
            return 'none';
        }
    };

    $scope.getTileStyle = tile => {
        return {
            left: 80 * tile.x,
            top: 80* tile.y + 40 * ((tile.x + 1) % 2)
        };
    };

    $scope.selectTile = tile => {
        switch ($scope.model.mode) {
            case 'move':
                $scope.model.mode = null;
                mapService.orderMove($scope.model.selectedTile, tile);
                break;
            default:
                $scope.model.selectedTile = tile;
        }
    }
});
