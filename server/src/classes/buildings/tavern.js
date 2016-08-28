let Building = require('./building');

class Tavern extends Building {
	constructor (city) {
		super(city);
		this.productionCost = 100;
	}
}

module.exports = Tavern;