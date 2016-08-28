let Unit = require('../unit');

class Wolf extends Unit {
    constructor () {
        super();
        this.hp = 8;
        this.armor = 0;
        this.attack = 3;

        this.perks = [];

        this.image = 'strywryherg7457vd';
    }
}

module.exports = Wolf;
