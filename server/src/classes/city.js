let Tavern = require('./buildings/Tavern');
let Farm = require('./buildings/Farm');

global.service.registerHandler('city', (params, player) => {
    var city = player.getCity();
    return city.getJson();
});

class City {
	constructor (world, x, y) {
	    this.world = world;
        this.x = x;
        this.y = y;

		this.population = 5;
		this.happiness = 5;
		this.prestige = 5;
		this.food = 10;
		this.baseProduction = 4;
		this.luxury = 2;

		this.buildings = [];

		this.idlePopulation = this.population;

		// TODO: that should be done by the world builder
		this.build(Tavern);
		this.build(Farm, 1, 1);
		this.build(Farm, 2, 1);
	}

	getJson () {
	    return {
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

	build (BuildingClass, x, y) {
		let building = this.startBuilding(BuildingClass, x, y);
		building.finish();
	}

	startBuilding (BuildingClass, x, y) {
		let building = new BuildingClass(this, x, y);
		this.buildings.push(building);

		return building;
	}

	reserveIdler () {
		return this.idlePopulation > 0 ? !!(this.idlePopulation--) : false;
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
		this.idlePopulation = this.population;

		this.buildings.forEach(building => {
			if (building.isComplete()) {
				if (building.isWorking()) {
					if (this.idlePopulation > 0) {
						this.idlePopulation--;
						building.cycle();
					} else {
						building.stopWorking();
					}
				}
			}
		});

		this.buildings.forEach(building => {
			if (!building.isComplete() && remainingProduction) {
				remainingProduction = building.progressBuild(remainingProduction);
			}
		});

		this.eat();

		this.waste();

        global.service.sendUpdate('city', this.owner, this.getJson());
	}
}

module.exports = City;
