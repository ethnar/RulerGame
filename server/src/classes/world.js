class World {
	constructor () {
	    this.AIs = [];
        this.cities = [];
        this.armies = [];
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

    getPlayers () {
        return this.players;
    }

    run () {
        this.loop();
    }

    loop () {
        this.cycle();
        setTimeout(this.loop.bind(this), 1000);
    }

    cycle () {
        this.AIs.forEach(AI => {
            AI.cycle();
        });
        this.cities.forEach(city => {
            city.cycle();
        });
        this.armies.forEach(army => {
            army.cycle();
            army.preparePerks();
        });
        this.armies.forEach(army => {
            army.executePerks();
        });
        this.armies.forEach(army => {
            army.fight();
        });
        this.armies.forEach(army => {
            army.checkCasualties();
        });

        // this.armies.forEach(army => {
        //     let hps = army.units.map(unit => unit.currentHp || unit.hp).join(' ');
        //     console.log(army.owner.getName() + ': ' + hps);
        // });
    }
}

module.exports = World;
