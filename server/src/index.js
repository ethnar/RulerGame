let Service = require('./classes/service');
global.service = new Service();

let World = require('./classes/world');
global.world = new World();

world.run();

process.on('uncaughtException', function (exception) {
    console.log(exception.stack);
});
