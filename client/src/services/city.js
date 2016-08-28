angular.module('RulerGame')

.service('cityService', function (serverService) {
    this.data = {};
    this.availableBuildings = [];

    serverService.request('city').then(response => {
        angular.extend(this.data, response);
    });
    serverService.onUpdate('city', update => {
        angular.extend(this.data, update);
    });

    serverService.request('availableBuildings').then(response => {
        while (this.availableBuildings.length) this.availableBuildings.pop();
        response.forEach(item => {
            this.availableBuildings.push(item);
        });
    });
    serverService.onUpdate('availableBuildings', update => {
        while (this.availableBuildings.length) this.availableBuildings.pop();
        update.forEach(item => {
            this.availableBuildings.push(item);
        });
    });

    this.getAvailableBuildings = () => {
        return this.availableBuildings;
    };

    this.recruitWorker = () => {
        serverService.request('recruit', {
            type: 'worker'
        });
    };
    this.recruitWarrior = () => {
        serverService.request('recruit', {
            type: 'warrior'
        });
    };
    this.orderBuild = (tile, building) => {
        serverService.request('build', {
            type: building,
            x: tile.x,
            y: tile.y
        });
    };
});
