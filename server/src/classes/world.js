let worldbuilder = require('./worldbuilder.js');

class World {
	constructor () {
		this.cities = [];
        this.players = [];

        global.service.registerHandler('authenticate', (params, previousPlayer, conn) => {
            let player = this.players.find((player) => {
                return player.verifyUsernameAndPassword(params.user, params.password);
            });
            if (player) {
                global.service.setPlayer(conn, player);
            }
            return !!player;
        });
    }

	getService () {
	    return this.service;
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
