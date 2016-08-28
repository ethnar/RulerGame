let City = require('./city');
let Player = require('./player');

class WorldBuilder {
    createWorld (world) {
        let [x, y] = world.getNewCityLocation();

        let player = new Player(world);
        let testCity = new City(world, x, y);

        testCity.setOwner(player);

        // TODO: doesn't make sense
        world.addPlayer(player);
    	world.addCity(testCity);
    }
}

module.exports = new WorldBuilder();
