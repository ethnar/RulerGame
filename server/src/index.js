let Service = require('./classes/service');
global.service = new Service();

let worldBuilder = require('./scenarios/random');
let World = require('./classes/world');
global.world = new World();

worldBuilder.createWorld();
world.run();

process.on('uncaughtException', function (exception) {
    console.log(exception.stack);
});
