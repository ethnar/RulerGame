
class Map {
    constructor (world) {
        this.world = world;
        this.tiles = [];

        world.getService().registerHandler('map', params => {
            setTimeout(() => {
                this.world.getService().sendUpdate('map', {somestuff: 'This is an update'});
            }, 1000);

            return this.tiles;
        });
    }
}

module.exports = Map;
