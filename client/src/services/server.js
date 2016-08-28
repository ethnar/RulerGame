angular.module('RulerGame')

.service('serverService', function ($websocket, $q) {
    let pendingRequests = {};
    let updateHandlers = {};
    let connection = $websocket('ws://localhost:8001/ruler');

    connection.onMessage(string => {
        let json = JSON.parse(string.data);
        if (json.request) {
            if (pendingRequests[json.request]) {
                pendingRequests[json.request].resolve(json.data);
            } else {
                throw new Error('Received response to a request that wasn\'t sent');
            }
        }
        if (json.update) {
            if (updateHandlers[json.update]) {
                updateHandlers[json.update](json.data);
            } else {
                throw new Error('Received update that does not have a handler');
            }
        }
    });

    this.request = (name, params) => {
        if (!pendingRequests[name]) {
            let defer = $q.defer();
            connection.send(JSON.stringify({
                request: name,
                params: params
            }));
            pendingRequests[name] = defer;
        }
        return pendingRequests[name].promise;
    };

    this.onUpdate = (name, handler) => {
        if (updateHandlers[name]) {
            throw new Error('Adding handler to replace already existing handler');
        }
        updateHandlers[name] = handler;
    };
});
