let MapBuilding = require('./map-building');

class Farm extends MapBuilding {
	constructor (city) {
		super(city);
		this.productionCost = 300;
	}

	getImage () {
	    return 'asdasdasd';
    }

	cycle () {
		this.city.modifyFood(+3);
	}
}

module.exports = Farm;