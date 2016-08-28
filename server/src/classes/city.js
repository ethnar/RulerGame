let Entity = require('./entity');
let Army = require('./army');

let Worker = require('./units/humans/worker');
let Militia = require('./units/humans/militia');

global.service.registerHandler('city', (params, player) => {
    if (!player) {
        return;
    }
    let city = player.getCity();
    return city.getResponseData();
});

global.service.registerHandler('availableBuildings', (params, player) => {
    if (!player) {
        return;
    }
    return player.getAvailableBuildings();
});

global.service.registerHandler('recruit', (params, player) => {
    if (!player) {
        return;
    }
    let city = player.getCity();
    return city.recruit(params.type);
});

class City extends Entity {
	constructor (name) {
	    super('cities');

		this.name = name;
		this.population = 5;
		this.happiness = 5;
		this.prestige = 5;
		this.food = 10;
		this.baseProduction = 4;
		this.luxury = 2;

		this.buildings = [];

		this.idlePopulation = this.population;
	}

	setTile (tile) {
	    this.tile = tile;
    }

	getTile () {
		return this.tile;
	}

    getResponseData () {
	    return {
	        name: this.name,
            population: this.population,
            prestige: this.prestige,
            food: this.food,
            luxury: this.luxury
        };
    }

    setOwner (player) {
        this.owner = player;
        player.city = this;
    }

    recruit (type) {
        let unit;
        switch (type) {
            case 'worker':
                unit = new Worker();
                break;
            case 'warrior':
                unit = new Militia();
                break;
        }
        if (!unit) {
            return false;
        }

        let army = this.tile.getArmy();
        if (!army) {
            army = new Army(this.owner, this.tile);
        }
        if (army.owner !== this.owner) {
            return false;
        }

        if (this.reserveIdler()) {
            army.addUnit(unit);
        }
    }

	build (BuildingClass, tile) {
		let building = this.startBuilding(BuildingClass, tile);
        this.reserveIdler();
		building.finish();
	}

	startBuilding (BuildingClass, tile) {
		let building = new BuildingClass(this, tile);

        if (!building.isCityBuilding()) {
            tile.placeBuilding(building);
            tile.sendUpdate();
        }
		this.buildings.push(building);
		return building;
	}

	reserveIdler () {
		return this.idlePopulation > 0 ? !!(this.idlePopulation--) : false;
	}

    getPopulation () {
        return this.population;
    }

    getOwner () {
        return this.owner;
    }

	getProduction () {
		return this.baseProduction + this.buildings.reduce((last, building) => last + building.getProduction(), 0);
	}

	eat () {
		let foodNeeded = this.population;
		let foodUsed = Math.min(foodNeeded, this.food);
		if (foodUsed < foodNeeded) {
			console.log('Not enough food');
		}
		this.food -= foodUsed;
	}

	waste () {
		let waste = Math.floor(Math.max(this.food / this.population - 3, 0));
		this.food -= Math.min(waste, this.food);
	}

	modifyFood (delta) {
		if (-delta > this.food) {
			return false;
		}
		this.food += delta;
		return true;
	}

	cycle () {
		let remainingProduction = this.getProduction();

		this.buildings.forEach(building => {
			if (building.isComplete() && building.isWorking()) {
                building.cycle();
			}
		});

		this.buildings.forEach(building => {
			if (!building.isComplete() && remainingProduction) {
				remainingProduction = building.progressBuild(remainingProduction);
			}
		});

		this.eat();

		this.waste();

        global.service.sendUpdate('city', this.owner, this.getResponseData());
	}
}

module.exports = City;
