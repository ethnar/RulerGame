let Unit = require('../unit');

class Militia extends Unit {
    constructor () {
        super();
        this.hp = 10;
        this.armor = 1;
        this.attack = 4;

        this.image = 'bsfty45yheyu358';
    }
}

module.exports = Militia;
