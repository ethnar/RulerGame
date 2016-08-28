class Player {
    constructor (world, name, password) {
        this.city = null;
        this.name = name;
        this.password = password;
    }

    getCity () {
        return this.city;
    }

    verifyUsernameAndPassword (name, password) {
        return this.password === password && this.name === name;
    }
}

module.exports = Player;
