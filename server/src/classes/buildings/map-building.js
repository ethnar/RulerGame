let Building = require('./building');

class MapBuilding extends Building {
	constructor (city, x, y) {
		super(city);
		this.x = x;
		this.y = y;
	}
}

module.exports = MapBuilding;
