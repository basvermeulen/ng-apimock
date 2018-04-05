(function () {
    'use strict';

    function Api($websocket, $resource, $window, $document, $sce) {

        var connection = $websocket('ws://localhost:9900/api');

        return {
            send: send,
            response: response
        };

        function send(data) {
            connection.send(JSON.stringify(data));
        }

        function response(callback) {
            connection.onMessage(callback);
        }

    }

    Api.$inject = ['$websocket', '$resource', '$window', '$document', '$sce'];

    angular
        .module('ngApimock-example')
        .service('api', Api);

})();