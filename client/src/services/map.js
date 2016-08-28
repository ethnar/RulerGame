angular.module('RulerGame')

.service('mapService', function (serverService) {
    this.data = {};

    serverService.request('map').then(response => {
        angular.extend(this.data, response);
    });

    serverService.onUpdate('map', update => {
        angular.extend(this.data, update);
    });

    serverService.onUpdate('tile', update => {
        angular.extend(this.data[update.x][update.y], update.data);
    });

    this.orderMove = (fromTile, toTile) => {
        serverService.request('orderMove', {
            from: { x: fromTile.x, y: fromTile.y },
            to: { x: toTile.x, y: toTile.y }
        });
    };
});
