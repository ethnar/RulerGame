let MapTile = require('./map-tile');

// TODO implicit singleton
class WorldMap {
    constructor (sizeX, sizeY) {
        this.tiles = [];
        this.sizeX = sizeX;
        this.sizeY = sizeY;

        for (let x = 0; x < sizeX; x++) {
            this.tiles[x] = [];
            for (let y = 0; y < sizeY; y++) {
                this.tiles[x][y] = new MapTile(MapTile.types.GRASSLAND, x, y);
            }
        }

        global.service.registerHandler('map', (params, player) => {
            if (!player) {
                return null;
            }
            return this.getResponseData(player);
        });
    }

    setTerrainType (x, y, type) {
        this.tiles[x][y].setType(type);
    }

    getTerrainType (x, y) {
        return this.tiles[x][y].getType();
    }

    getResponseData (player) {
        return this.tiles.map(column => {
            return column.map(tile => {
                return tile.getResponseData(player);
            })
        })
    }

    getTile (x, y) {
        return this.tiles[x][y];
    }

    getNewCityLocation () {
        let validLocations = [];
        for (let x = 0; x < this.sizeX; x++) {
            for (let y = 0; y < this.sizeY; y++) {
                let tile = this.tiles[x][y];
                if (tile.getType() === MapTile.types.MOUNTAINS) {
                    continue;
                }
                if (tile.getCity() || tile.getBuilding()) {
                    continue;
                }
                let closeTiles = this.getNeighbouringTiles(tile, 1);
                let furtherTiles = this.getNeighbouringTiles(tile, 2);

                let closeMountains = closeTiles.filter(tile => {
                    return tile.getType() === MapTile.types.MOUNTAINS;
                }).length;
                let furtherGrasslands = furtherTiles.filter(tile => {
                    return tile.getType() === MapTile.types.GRASSLAND;
                }).length;
                let furtherForests = furtherTiles.filter(tile => {
                    return tile.getType() === MapTile.types.FOREST;
                }).length;
                let furtherHills = furtherTiles.filter(tile => {
                    return tile.getType() === MapTile.types.HILLS;
                }).length;

                if (closeMountains >= 2 ||
                    furtherGrasslands < 5 ||
                    furtherForests < 2 ||
                    furtherHills < 1) {
                    continue;
                }

                let nearbyCities = global.world.cities.filter(city => {
                    return this.getDistance(tile, city.getTile()) < 8;
                }).length;

                if (nearbyCities >= 1) {
                    continue;
                }
                validLocations.push(tile);
            }
        }
        if (!validLocations.length) {
            return null;
        }
        return validLocations[Math.floor(Math.random() * validLocations.length)];
    }

    getDistance (start, dest) {
        let xDistance = Math.abs(start.x - dest.x);
        xDistance = Math.min(xDistance, Math.abs(xDistance - this.sizeX));
        let yDistance = Math.abs(start.y - dest.y);
        yDistance = Math.min(yDistance, Math.abs(yDistance - this.sizeY));
        return Math.sqrt(
            Math.pow(xDistance, 2) + Math.pow(yDistance, 2)
        );
    }

    getNeighbouringTiles (tile, range = 1) {
        let zigzag = (tile.x % 2) ? -1 : +1;
        let dirs = [
            [-1, 0],
            [+1, 0],
            [0, -1],
            [0, +1],
            [-1, zigzag],
            [+1, zigzag]
        ];
        if (range === 2) {
            dirs = dirs.concat([
                [-2, 0],
                [+2, 0],
                [0, -2],
                [0, +2],
                [-1, -2],
                [+1, -2],
                [-1, +2],
                [+1, +2],
                [-1, -zigzag],
                [+1, -zigzag],
                [-1, zigzag * 2],
                [+1, zigzag * 2]
            ]);
        }
        return dirs.map(([x, y]) => {
            x = (tile.x + x + this.sizeX) % this.sizeX;
            y = (tile.y + y + this.sizeY) % this.sizeY;
            return this.tiles[x][y];
        });
    }
}

module.exports = WorldMap;
