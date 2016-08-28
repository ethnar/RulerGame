let AI = require('./ai');

class AnimalsAI extends AI {
    constructor (player) {
        super(player);
    }

    cycle() {
        global.world.armies.filter(army => {
            return army.getOwner() === this.player;
        }).forEach(army => {
            if (!army.getMoveOrders().length) {
                let tiles = global.worldMap.getNeighbouringTiles(army.getTile()).filter(tile => {
                    return !tile.army;
                });
                let target = tiles[Math.floor(Math.random() * tiles.length)];
                army.orderMove(target);
            }
        });
    }
}

module.exports = AnimalsAI;
