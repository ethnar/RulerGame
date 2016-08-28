let City = require('./city');
let Player = require('./player');
let WorldMap = require('./world-map.js');

class WorldBuilder {
    createWorld (world) {
        let map = new WorldMap(world);

        let [x, y] = map.getNewCityLocation();

        let player = new Player(world, 'ethnar', 'abc');
        let testCity = new City(world, x, y);

        testCity.setOwner(player);

        // TODO: doesn't make sense
        world.addPlayer(player);
    	world.addCity(testCity);
    }
}

module.exports = new WorldBuilder();
