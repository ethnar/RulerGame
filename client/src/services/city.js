angular.module('RulerGame')

    .service('cityService', function (serverService) {
        this.data = {};

        serverService.request('city').then(response => {
            angular.extend(this.data, response);
        });

        serverService.onUpdate('city', update => {
            angular.extend(this.data, update);
        });
    });
