let Unit = require('../unit');

class Guardsman extends Unit {
    constructor () {
        super();
        this.hp = 20;
        this.armor = 4;
        this.attack = 6;

        this.perks = [Unit.perks.REACH];

        this.image = '1';
    }
}

module.exports = Guardsman;
