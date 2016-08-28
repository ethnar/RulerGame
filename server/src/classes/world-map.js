
// TODO implicit singleton
class Map {
    constructor (world) {
        this.world = world;
        this.tiles = [];

        global.service.registerHandler('map', (params, player) => {
            if (!player) {
                return null;
            }
            return this.tiles;
        });
    }

    getNewCityLocation () {
        return [10, 10];
    }
}

module.exports = Map;
