let ws = require('nodejs-websocket');

class Service {
    constructor () {
        this.connections = [];
        this.handlers = {};

        ws.createServer((conn) => {
            console.log('New connection');
            this.connections.push(conn);

            conn.on('text', (str) => {
                let json = JSON.parse(str);

                let response = {
                    request: json.request,
                    data: this.handleRequest(json)
                };

                conn.sendText(JSON.stringify(response));
            });

            conn.on("close", (code, reason) => {
                let idx = this.connections.indexOf(conn);
                this.connections.splice(idx, 1);
                console.log("Connection closed")
            });
        }).listen(8001);
    }

    handleRequest (request) {
        if (!this.handlers[request.request]) {
            console.error('Invalid request');
            return null;
        } else {
            return this.handlers[request.request](request.params);
        }
    }

    registerHandler (topic, callback) {
        this.handlers[topic] = this.handlers[topic] ? this.handlers[topic] : [];
        this.handlers[topic].push(callback);
    }

    sendUpdate (topic, data) {
        this.connections.forEach(connection => {
            connection.sendText(JSON.stringify({
                update: topic,
                data: data
            }));
        });
    }
}

module.exports = Service;