let Entity = require('./entity');
let MapTile = require('./map-tile');

let Farm = require('./buildings/farm');
let Tavern = require('./buildings/tavern');

global.service.registerHandler('orderMove', (params, player) => {
    try {
        let fromTile = global.worldMap.getTile(params.from.x, params.from.y)
        let toTile = global.worldMap.getTile(params.to.x, params.to.y)
        if (!fromTile.getArmy() || fromTile.getArmy().getOwner() !== player) {
            console.error('Hacking attempt?');
            console.log(params);
            console.log(player);
            return null;
        }
        fromTile.getArmy().orderMove(toTile);
        return true;
    } catch (e) {
        console.error(e);
    }
});

class Player extends Entity {
    constructor (name, password, npc) {
        super('players');

        this.standings = new Map();
        this.translate = [0, 0];

        this.city = null;
        this.name = name;
        this.password = password;
        this.npc = !!npc;
    }

    translateCoordinates ([x, y]) {
        return [x + this.translate[0], y + this.translate[1]];
    }

    getStanding (player) {
        if (player === this) {
            return 'self';
        }
        return this.standings[player] || 'neutral';
    }

    getName () {
        return this.name;
    }

    getCity () {
        return this.city;
    }

    verifyUsernameAndPassword (name, password) {
        return !this.npc && this.password === password && this.name === name;
    }

    getAvailableBuildings (full) {
        // TODO: do this properly
        return [{
            type: 'Farm',
            terrain: MapTile.types.GRASSLAND,
            city: false,
            className: full ? Farm : null
        }, {
            type: 'Tavern',
            city: true,
            className: full ? Tavern : null
        }];
    }
}

Player.standings = {
    HOSTILE: 'hostile'
};

Player.setStanding = function (player1, player2, standing) {
    player1.standings[player2] = standing;
    player2.standings[player1] = standing;
};

module.exports = Player;
