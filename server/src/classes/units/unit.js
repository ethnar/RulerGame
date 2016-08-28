class Unit {
    constructor () {
        this.buffs = [];
        this.perks = [];

        this.armor = 0;
        this.attack = 0;
    }

    getResponseData (player) {
        return {
            image: this.image,
            hp: this.currentHp
        }
    }

    getArmor () {
        return this.armor;
    }

    getStrength () {
        return this.hp + this.attack;
    }

    getImage () {
        return this.image;
    }

    preparePerks () {
        this.perks.forEach(perk => {
            if (perk.prepare) {
                perk.prepare(this);
            }
        });
    }

    executePerks (targets) {
        this.perks.forEach(perk => {
            if (perk.execute) {
                perk.execute(this, targets);
            }
        });
    }

    attackEnemy (target) {
        if (this.attack) {
            let damage = Math.max(this.attack - target.getArmor(), 1);
            this.perks.forEach(perk => {
                if (perk.onAttack) {
                    damage = perk.onAttack(this, damage);
                }
            });
            target.perks.forEach(perk => {
                if (perk.onHit) {
                    damage = perk.onHit(target, damage);
                }
            });
            target.receiveDamage(damage);
        }
    }

    receiveDamage (damage) {
        if (this.currentHp === undefined) {
            this.currentHp = this.hp;
        }
        this.currentHp = this.currentHp -= damage;
    }

    isDead () {
        return this.currentHp !== undefined && this.currentHp <= 0;
    }
}

Unit.perks = {
    REACH: {
        name: 'Reach',
        icon: 'TODO',
        prepare: unit => {
            unit.buffs[Unit.perks.REACH] = true;
        },
        execute: (unit, targets) => {
            let validTargets = targets.filter(target => target.buffs[Unit.perks.MOUNTED]);
            if (validTargets.length) {
                let target = validTargets[Math.floor(Math.random() * validTargets.length)];
                target.buffs[Unit.perks.MOUNTED] = false;
            }
        },
        onAttack: (unit, damage) => {
            return damage * 1.5;
        }
    },
    MOUNTED: {
        name: 'Mounted',
        icon: 'TODO',
        prepare: unit => {
            unit.buffs[Unit.perks.MOUNTED] = true;
        },
        execute: (unit, targets) => {
            // TODO
            // let validTargets = targets.filter(target => target.buffs[Unit.perks.MOUNTED]);
            // let target = validTargets[Math.floor(Math.random() * validTargets.length)];
            // target.buffs[Unit.perks.MOUNTED] = false;
        },
        onAttack: (unit, damage) => {
            return damage * 1.5;
        }
    },
    WORKER: {
        name: 'Worker',
        icon: 'TODO'
    }
};

module.exports = Unit;
