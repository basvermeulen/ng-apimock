(function () {
    'use strict';

    function MockingController(mockService, $interval, $window) {
        var vm = this;

        vm.delayMock = delayMock;
        vm.selectMock = selectMock;
        vm.defaultMocks = defaultMocks;
        vm.passThroughMocks = passThroughMocks;

        vm.$onInit = function () {
            fetchMocks();
            fetchVariables();

            vm.variable = {
                key: undefined,
                value: undefined
            };
        };

        /** Fetch all the mocks and make them available. */
        function fetchMocks() {
            mockService.get({}, function (response) {
                vm.mocks = response.mocks.map(function(mock){
                    Object.keys(mock.responses).forEach(function(response) {
                        mock.responses[response].name = response;
                    });
                    return mock;
                });
                vm.selections = response.selections;
                vm.delays = response.delays;
            });
        }

        /**
         * Refresh the mocks from the connect server
         */
        function refreshMocks() {
            mockService.get({}, function (response) {
                angular.merge(vm.mocks, response.mocks);
                vm.selections = response.selections;
            });
        }

        /**
         * Update the given Delay time.
         * @param mock The mock.
         * @param delay The delay.
         */
        function delayMock(mock, delay) {
            mockService.update({'identifier': mock.identifier, 'delay': delay}, function () {
                vm.delays[mock.identifier] = delay;
            });
        }

        /**
         * Select the given response.
         * @param mock The mock.
         * @param selection The selection.
         */
        function selectMock(mock, selection) {
            mockService.update({'identifier': mock.identifier, 'scenario': selection || 'passThrough'}, function () {
                vm.selections[mock.identifier] = selection;
            });
        }

        /** Reset all selections to default. */
        function defaultMocks() {
            mockService.setAllToDefault({}, function () {
                $window.location.reload();
            });
        }

        /** Reset all selections to passThrough. */
        function passThroughMocks() {
            mockService.setAllToPassThrough({}, function () {
                $window.location.reload();
            });
        }

    }

    MockingController.$inject = ['mockService', '$interval', '$window'];

    /**
     * @ngdoc controller
     * @module ng-apimock
     * @name NgApimockController
     * @description
     * # Controller for selecting mocks.
     * Controller in the ng-apimock
     */
    angular
        .module('ng-apimock')
        .controller('NgApimockController', MockingController);
})();