let City = require('../classes/city');
let Player = require('../classes/player');
let WorldMap = require('../classes/world-map');
let MapTile = require('../classes/map-tile');

let Army = require('../classes/army');
let Militia = require('../classes/units/humans/militia');
let Guardsman = require('../classes/units/humans/guardsman');
let Wolf = require('../classes/units/animals/wolf');

let Tavern = require('../classes/buildings/tavern');
let Farm = require('../classes/buildings/farm');

let AnimalsAI = require('../classes/ai/animals');

class WorldBuilder {
    createWorld () {
        let mapSize = 10;
        let map = new WorldMap(mapSize, mapSize);
        global.worldMap = map;

        for (let i=0; i < mapSize * 4; i++) {
            let x = Math.floor(Math.random() * mapSize);
            let y = Math.floor(Math.random() * mapSize);
            map.setTerrainType(x, y, MapTile.types.FOREST);
        }
        for (let i=0; i < mapSize; i++) {
            let x = Math.floor(Math.random() * mapSize);
            let y = Math.floor(Math.random() * mapSize);
            map.setTerrainType(x, y, MapTile.types.MOUNTAINS);
        }
        for (let i=0; i < mapSize / 3; i++) {
            let x = Math.floor(Math.random() * mapSize);
            let y = Math.floor(Math.random() * mapSize);
            map.setTerrainType(x, y, MapTile.types.HILLS);
        }
        for (let cycle = 0; cycle < 8; cycle++) {
            for (let x = 0; x < mapSize; x++) {
                for (let y = 0; y < mapSize; y++) {
                    let tiles = map.getNeighbouringTiles(map.getTile(x, y));
                    let forests = tiles.filter(tile => {
                        return tile.getType() === MapTile.types.FOREST;
                    }).length;
                    let mountains = tiles.filter(tile => {
                        return tile.getType() === MapTile.types.MOUNTAINS;
                    }).length;
                    let hills = tiles.filter(tile => {
                        return tile.getType() === MapTile.types.HILLS;
                    }).length;
                    let chances = [0, 30, 200, 10, 10, 1, 1];
                    if (mountains && Math.random() * 1000 < chances[mountains]) {
                        map.setTerrainType(x, y, MapTile.types.MOUNTAINS);
                    }
                    if (map.getTerrainType(x, y) !== MapTile.types.MOUNTAINS) {
                        if ((mountains || hills) && Math.random() * 1000 < (mountains * 50 + hills * 10 + 10)) {
                            map.setTerrainType(x, y, MapTile.types.HILLS);
                        }
                        if (forests && Math.random() * 1000 < (forests * 10 + 30)) {
                            map.setTerrainType(x, y, MapTile.types.FOREST);
                        }
                    }
                }
            }
        }



        let animals = new Player('animals', null, true);
        new AnimalsAI(animals);

        let tile = map.getNewCityLocation();
        let x = tile.x;
        let y = tile.y;

        let player = new Player('ethnar', 'abc');
        let testCity = new City('Menzoberranzan');
        testCity.setOwner(player);

        Player.setStanding(animals, player, Player.standings.HOSTILE);

        testCity.build(Tavern);
        testCity.build(Farm, map.getTile(1, 1));
        testCity.build(Farm, map.getTile(2, 1));

        let army1 = new Army(animals, map.getTile(5, 5));
        army1.addUnit(new Wolf());

        tile.placeCity(testCity);
    }
}

module.exports = new WorldBuilder();
