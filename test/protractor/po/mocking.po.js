(function () {
    'use strict';

    /**
     * Mocking page object.
     * @constructor
     */
    function MockingPO() {
        const po = this;
        /** Get all the mocks. */
        po.mocks = element.all(by.repeater('mock in $ctrl.mocks'));
        /** Get the mock by name. */
        po.mock = (name) => new MockPO(this.mocks
            .filter((mock) => mock.getAttribute('identifier')
                .then((identifier) => identifier === name))
            .first());

        po.setToPassThroughs = element(by.buttonText('All to passThrough'));
        po.resetsToDefaults = element(by.buttonText('Reset to defaults'));
    }

    function MockPO(container) {
        const po = this;
        po.container = container;
        po.expression = po.container.element(by.binding('::mock.expression.toString()'));
        po.method = po.container.element(by.binding('::mock.method'));
        po.name = po.container.element(by.binding('::mock.name'));
        po.scenario = po.container.element(by.tagName('select'));
        po.delay = po.container.element(by.model('delay'));
        po.isPresent = () => po.container.isPresent();
    }

    module.exports = MockingPO;
})();