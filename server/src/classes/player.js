class Player {
    constructor (world) {
        this.city = null;

        world.getService().registerHandler('authenticate', params => {
            setTimeout(() => {
                this.world.getService().sendUpdate('map', {somestuff: 'This is an update'});
            }, 1000);

            return this.tiles;
        });
    }

    getCity () {
        return this.city;
    }

}

module.exports = Player;
