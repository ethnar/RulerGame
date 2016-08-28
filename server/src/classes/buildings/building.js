
class Building {
	constructor (city) {
		this.city = city;
		this.productionCost = 100;
		this.productionProgress = 0;
	}

	progressBuild (production) {
		let usedProduction = Math.min(production, this.productionCost - this.productionProgress);
		this.productionProgress += usedProduction;
		if (this.isComplete()) {
			this.finish();
		}
		return production - usedProduction;
	}

	finish () {
		this.productionProgress = this.productionCost;
		this.durability = 100;
		this.working = this.city.reserveIdler();
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

	cycle () {

	}

	getProduction () {
		return 0;
	}
}

module.exports = Building;
