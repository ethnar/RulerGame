
class Map {
    constructor (world) {
        this.world = world;
        this.tiles = [];

        world.getService().registerHandler('map', (params, player) => {
            return this.tiles;
        });
    }
}

module.exports = Map;
