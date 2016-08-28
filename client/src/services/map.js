angular.module('RulerGame')

.service('mapService', function (serverService) {
    this.data = null;

    serverService.request('map').then(response => {
        this.data = response;
    });

    serverService.onUpdate('map', update => {
        this.data = update;
    });
});
