let Entity = require('../entity');

class AI extends Entity {
    constructor (player) {
        super('AIs');
        this.player = player;
    }
}

module.exports = AI;
