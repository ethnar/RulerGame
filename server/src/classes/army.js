let Entity = require('./entity');
let Player = require('./player');
let Battle = require('./battle');
let MapTile = require('./map-tile');
let Unit = require('./units/unit');

global.service.registerHandler('build', (params, player) => {
    let army = global.worldMap.getTile(params.x, params.y).getArmy();
    if (!army || !player || army.getOwner() !== player) {
        return;
    }
    return army.build(params.type);
});

class Army extends Entity {
    constructor (player, tile) {
        super('armies');

        this.units = [];
        this.owner = player;
        this.battles = [];
        this.stance = Army.stances.AGGRESSIVE;
        this.food = 0;

        this.movingTo = [];

        tile.placeArmy(this);
    }

    addUnit (unit) {
        this.units.push(unit);
        this.tile.sendUpdate();
    }

    removeUnit (unit) {
        let idx = this.units.indexOf(unit);
        this.units.splice(idx, 1);

        if (!this.units.length) { // TODO it's copy paste
            this.destroy();
        } else if (count != this.units.count) {
            this.tile.sendUpdate();
        }
    }

    setTile (tile) {
        this.tile = tile;
        this.checkBattles();
    }

    getTile () {
        return this.tile;
    }

    getStrongestUnit () {
        return this.units.reduce((last, unit) => {
            return !last || last.getStrength() < unit.getStrength() ? unit : last;
        }, null);
    }

    getOwner () {
        return this.owner;
    }

    getStance () {
        return this.stance;
    }

    getUnits () {
        return this.units;
    }

    getResponseData (player) {
        if (!this.units.length) {
            return null;
        }
        let owner = this.getOwner();
        let moving;
        if (owner === player) {
            moving = !this.movingTo.length ? null : {
                tiles: this.movingTo.map(tile => {
                    return {x: tile.x, y: tile.y}
                }),
                steps: this.steps
            };
        }
        return {
            icon: this.getStrongestUnit().getImage(),
            units: this.units.map(unit => unit.getResponseData(player)),
            owner: owner ? owner.getName() : null,
            standing: player.getStanding(owner),
            moving: moving,
            battles: this.battles.map(battle => {
                return battle.id;
            })
        }
    }

    cycle () {
        if (this.movingTo.length) {
            if (this.movingTo[0].getArmy()) {
                this.cancelMove();
            } else {
                this.steps += 1;
                if (this.steps >= 3) {
                    this.move();
                }
            }
        }
    }

    build (type) {
        let owner = this.getOwner();
        let buildingType = owner.getAvailableBuildings(true).find(building => building.type === type);
        let tile = this.getTile();
        if (!buildingType || tile.getType() !== buildingType.terrain || tile.getCity() || tile.getBuilding()) {
            console.error('Impossible to build');
            return;
        }
        let worker = this.units.find(unit => (unit.perks.indexOf(Unit.perks.WORKER) !== -1));
        if (!worker) {
            return;
        }
        this.removeUnit(worker);
        let city = owner.getCity();
        let building = city.startBuilding(buildingType.className, this.getTile());
    }

    orderMove (tile) {
        // TODO make sure it's legit
        let nearbyTiles = global.worldMap.getNeighbouringTiles(this.tile);
        if (nearbyTiles.indexOf(tile) === -1) {
            console.log('Invalid move order');
            return;
        }
        if (tile.getType() === MapTile.types.MOUNTAINS) {
            console.log('Invalid move over mountains');
            return;
        }
        if (this.movingTo[this.movingTo.length - 1] !== tile) {
            this.movingTo.push(tile);
            if (this.movingTo.length === 1) {
                this.steps = 0;
            }
            this.tile.sendUpdate();
        }
    }

    cancelMove () {
        if (this.movingTo.length) {
            this.movingTo = [];
            this.tile.sendUpdate();
        }
    }

    getMoveOrders () {
        return this.movingTo;
    }

    move () {
        this.steps = 0;
        let targetTile = this.movingTo.shift();
        if (!targetTile.getArmy()) {
            this.tile.removeArmy();
            targetTile.placeArmy(this);
            this.checkBattles();
        }
    }

    checkBattles () {
        this.battles.forEach(battle => battle.finish());
        let tiles = global.worldMap.getNeighbouringTiles(this.tile);
        tiles.filter(tile => {
            let army = tile.getArmy();
            return  army &&
                    army.getOwner().getStanding(this.owner) === Player.standings.HOSTILE &&
                    (this.stance === Army.stances.AGGRESSIVE || army.getStance() === Army.stances.AGGRESSIVE)
        }).forEach(tile => {
            let army = tile.getArmy();
            let battle = new Battle(army, this);
        });

        this.tile.sendUpdate();
    }

    checkCasualties () {
        let count = this.units.length;
        this.units = this.units.filter(unit => {
            return !unit.isDead();
        });

        if (!this.units.length) {
            this.destroy();
        } else if (count != this.units.count) {
            this.tile.sendUpdate();
        }
    }

    startBattle (battle) {
        this.battles.push(battle);
        this.tile.sendUpdate();
    }

    finishBattle(battle) {
        let idx = this.battles.indexOf(battle);
        this.battles.splice(idx, 1);
        if (this.units.length) {
            this.tile.sendUpdate();
        }
    }

    preparePerks () {
        this.units.forEach(unit => {
            unit.preparePerks();
        });
    }

    getHostileTargets () {
        return this.battles.reduce((last, battle) => {
            return last.concat(battle.getOpponent(this).getUnits());
        }, []);
    }

    executePerks () {
        let targets = this.getHostileTargets();
        this.units.forEach(unit => {
            unit.executePerks(targets);
        });
    }

    fight () {
        let targets = this.getHostileTargets();
        if (targets.length) {
            this.units.forEach(unit => {
                let target = targets[Math.floor(Math.random() * targets.length)];
                unit.attackEnemy(target);
            });
        }
    }

    destroy () {
        while (this.battles.length) {
            this.battles[0].finish();
        }
        this.tile.removeArmy();
        super.destroy();
    }
}

Army.stances = {
    AGGRESSIVE: 'aggressive',
    DEFENSIVE: 'defensive'
};

module.exports = Army;
