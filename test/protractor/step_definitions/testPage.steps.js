(() => {
    const {defineSupportCode} = require('cucumber');


    defineSupportCode(function ({When, Then}) {
        const fs = require('fs-extra');
        const path = require('path');
        const testPo = new (require('./../po/test.po'))();
        const mocksDirectory = path.join(process.cwd(), 'test', 'mocks', 'api');
        const responses = {
            list: fs.readJsonSync(path.join(mocksDirectory, 'some-api-list.mock.json')).responses,
            update: fs.readJsonSync(path.join(mocksDirectory, 'some-update.mock.json')).responses
        };
        const passThroughResponses = {
            list: [{a: "b"}],
            update: {c: "d"}
        };

        When(/^I open the test page$/, () => browser.get('/index.html'));

        Then(/^I switch to mocking interface$/, () =>
            testPo.switch.click()
                .then(() => browser.getAllWindowHandles()
                    .then((handles) => browser.driver.switchTo().window(handles[1]))));

        Then(/^the (?!passThrough)(.*) response should be returned for mock with name (.*)$/, (scenario, name) =>
            expect(testPo[name].data.getText()).to.eventually.equal(JSON.stringify(responses[name][scenario].data)));

        Then(/^the (?!passThrough)(.*) response should be returned with interpolated value (.*) for key (.*) for mock with name (.*)$/, (scenario, interpolatedValue, interpolatedKey, name) =>
            testPo[name].data.getText()
                .then((text) => {
                    expect(text.indexOf('%%' + interpolatedKey + '%%')).to.equal(-1);
                    expect(text.indexOf(interpolatedValue)).to.be.above(-1);
                }));

        Then(/^the passThrough response should be returned for mock with name (.*)$/, (name) =>
            expect(testPo[name].data.getText()).to.eventually.equal(JSON.stringify(passThroughResponses[name])));

        Then(/^the status code should be (.*) for mock with name (.*)$/, (statusCode, name) =>
            expect(testPo[name].error.getText()).to.eventually.equal(statusCode === 'undefined' ? '' : statusCode));

        When(/^I refresh$/, () => testPo.list.refresh.click());

        Then(/^the loading warning is visible$/, () =>
            expect(testPo.list.loading.getText()).to.eventually.equal('loading'));

        When(/^I wait a (\d+) milliseconds$/, (wait) => browser.sleep(wait));

        Then(/^the loading message is visible$/, () => {
            browser.ignoreSynchronization = false;
            return expect(testPo.list.loading.getText()).to.eventually.equal('finished');
        });
    });
})();