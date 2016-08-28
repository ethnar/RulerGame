let Entity = require('./entity');

class Battle extends Entity {
    constructor (army1, army2) {
        super('battles');
        this.army1 = army1;
        this.army2 = army2;
        army1.startBattle(this);
        army2.startBattle(this);
    }

    finish () {
        this.army1.finishBattle(this);
        this.army2.finishBattle(this);
        this.destroy();
    }

    getOpponent (army) {
        return army === this.army1 ? this.army2 : this.army1;
    }
}

module.exports = Battle;
