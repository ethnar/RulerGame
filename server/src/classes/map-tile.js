class MapTile {
    constructor (type, x, y) {
        this.type = type;
        this.city = null;
        this.building = null;
        this.army = null;
        this.x = x;
        this.y = y;
    }

    getBuilding () {
        return this.building;
    }

    getCity () {
        return this.city;
    }

    setType (type) {
        this.type = type;
    }

    getType () {
        return this.type;
    }

    getResponseData (player) {
        let [x, y] = player.translateCoordinates([this.x, this.y]);
        return {
            x: x,
            y: y,
            type: this.type,
            city: !this.city ? null : {
                name: this.city.name,
                population: this.city.getPopulation(),
                owner: this.city.getOwner().getName()
            },
            building: this.building ? this.building.getResponseData(player) : null,
            army: this.army ? this.army.getResponseData(player) : null
        }
    }

    getArmy () {
        return this.army;
    }

    removeArmy () {
        this.army = null;
        this.sendUpdate();
    }

    placeCity (city) {
        if (this.city || this.building) {
            throw new Error('Placing a city on an occupied space.');
        }
        this.city = city;
        city.setTile(this);
    }

    placeArmy (army) {
        if (this.army) {
            throw new Error('Moving an army to occupied space.');
        }
        this.army = army;
        army.setTile(this);
    }

    placeBuilding (building) {
        if (this.city || this.building) {
            throw new Error('Placing a building on an occupied space.');
        }
        this.building = building;
        building.setTile(this);
    }

    sendUpdate () {
        global.world.getPlayers().forEach(player => {
            global.service.sendUpdate('tile', player, {
                x: this.x,
                y: this.y,
                data: this.getResponseData(player)
            });
        });
    }
}

MapTile.types = {
    GRASSLAND: 'as45gOjrtgb35u5',
    FOREST: 'fery45YHEdfghe57ergb',
    HILLS: 'c567tryjhe56345u54r',
    MOUNTAINS: '45jrty6u5tyjnw45y24j'
};

module.exports = MapTile;
