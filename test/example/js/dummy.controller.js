(function () {
    'use strict';

    function DummyController(api) {
        var vm = this;

        vm.$onInit = function () {
            getList();
        };

        vm.refresh = getList;

        /** Gets the list of things. */
        function getList() {
            vm.loading = true;

            api.send({x: 'x', y: 'y'});

            api.response(function (message) {
                var data = JSON.parse(message.data);
                vm.loading = false;

                vm.list = {
                    data: data,
                    error: undefined
                };
            });
        }

    }

    DummyController.$inject = ['api'];

    angular
        .module('ngApimock-example')
        .controller('DummyController', DummyController);

})();