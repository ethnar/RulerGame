let worldbuilder = require('./worldbuilder.js');
let Map = require('./map.js');

class World {
	constructor (service) {
        this.service = service;
		this.cities = [];
        this.players = [];
        this.map = new Map(this);

        this.service.registerHandler('authenticate', (params, currentPlayer, conn) => {
            let player = this.players.find((player) => {
                return player.verifyUsernameAndPassword(params.user, params.password);
            });
            this.service.setPlayer(conn, player);
            return !!player;
        });
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
    }

    getPlayers () {
        return this.players;
    }
}

module.exports = World;
