let MapBuilding = require('./map-building');

class Farm extends MapBuilding {
	constructor (city) {
		super(city);
		this.productionCost = 300;
	}

	cycle () {
		this.city.modifyFood(+3);
	}
}

module.exports = Farm;