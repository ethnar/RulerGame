let worldbuilder = require('./worldbuilder.js');
let Map = require('./map.js');

class World {
	constructor (service) {
        this.service = service;
		this.cities = [];
        this.players = [];
        this.map = new Map(this);
	}

	getService () {
	    return this.service;
    }

    getNewCityLocation () {
        return [10, 10];
    }

    run () {
        worldbuilder.createWorld(this);

        this.loop();
    }

    loop () {
        this.cycle();
        setTimeout(this.loop.bind(this), 500);
    }

    cycle () {
        this.cities.forEach(city => {
            city.cycle();
        });
    }

    addCity (city) {
    	this.cities.push(city);
    }

    addPlayer (player) {
        this.players.push(player);
        player.setWorld(world);
    }
}

module.exports = World;
