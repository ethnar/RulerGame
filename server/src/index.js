let World = require('./classes/world');
let Service = require('./classes/service');

process.on('uncaughtException', function (exception) {
    console.log(exception.stack);
});

let service = new Service();
let world = new World(service);

world.run();
