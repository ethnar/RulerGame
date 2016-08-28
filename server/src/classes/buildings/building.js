
class Building {
	constructor (city) {
		this.city = city;
		this.productionCost = 100;
		this.productionProgress = 0;
        this.cityBuilding = true;
        this.working = true;
	}

	progressBuild (production) {
		let usedProduction = Math.min(production, this.productionCost - this.productionProgress);
		this.productionProgress += usedProduction;
		if (this.isComplete()) {
			this.finish();
		}
		return production - usedProduction;
	}

	getResponseData () {
		return {
		    image: this.getImage()
        };
	}

	isCityBuilding () {
	    return this.cityBuilding;
    }

	finish () {
		this.productionProgress = this.productionCost;
		this.durability = 100;
		console.log('finished building ' + this.constructor.name);
	}

	stopWorking () {
		this.working = false;
	}

	isWorking () {
		return this.working;
	}

	isComplete() {
		return this.productionProgress === this.productionCost;
	}

	setTile(tile) {
	    this.tile = tile;
    }

	cycle () {

	}

	getProduction () {
		return 0;
	}
}

module.exports = Building;
