angular.module('RulerGame')

.service('mapService', function (serverService) {
    this.data = {};

    serverService.request('map').then(response => {
        angular.extend(this.data, response);
    });

    serverService.onUpdate('map', update => {
        angular.extend(this.data, update);
    });
});
