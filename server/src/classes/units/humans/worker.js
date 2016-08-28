let Unit = require('../unit');

class Worker extends Unit {
    constructor () {
        super();
        this.hp = 10;
        this.armor = 0;
        this.attack = 1;

        this.perks = [Unit.perks.WORKER];

        this.image = 'bsfty45yheyu358';
    }
}

module.exports = Worker;
