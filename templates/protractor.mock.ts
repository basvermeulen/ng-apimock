import {browser, protractor, promise} from 'protractor';

import * as path from 'path';
import * as uuid from 'uuid';
import * as hooker from 'hooker';
import * as urljoin from 'url-join';
import request from 'then-request';
import {Options} from 'then-request/lib/Options';

const ngapimockid = uuid.v4();

export class NgWsApiMock {
    private _baseUrl = urljoin(browser.baseUrl, 'ngapimock');
    private _handleRequest: (method: 'PUT',
                             suffix: string,
                             opts: Options,
                             errorMsg: string) => promise.Promise<void> = (httpMethod, urlSuffix, opts, errorMessage) => {
        const deferred = protractor.promise.defer<void>();
        request(httpMethod, this._baseUrl + urlSuffix, opts).done((res) => {
            if (res.statusCode !== 200) {
                deferred.reject(errorMessage);
            } else {
                deferred.fulfill();
            }
        });
        return deferred.promise;
    };

    constructor() {
        /** Make sure that angular uses the ngapimock identifier for the requests. */
        browser.getProcessedConfig().then((config) => {
            // As of protractor 5.0.0 the flag config.useAllAngular2AppRoots has been deprecated, to let protractor tell
            // ngApimock that Angular 2 is used a custom object needs to be provided with the angular version in it
            // See: https://github.com/angular/protractor/blob/master/CHANGELOG.md#features-2
            if (config.useAllAngular2AppRoots || ('ngApimockOpts' in config && config.ngApimockOpts.angularVersion > 1)) {
                // angular 2 does not have addMockModule support @see https://github.com/angular/protractor/issues/3092
                // fallback to cookie
                hooker.hook(browser, 'get', {
                    post: function (result) {
                        return result.then(function () {
                            // Since protractor 5.0.0 the addCookie is an object, see
                            // https://github.com/angular/protractor/blob/master/CHANGELOG.md#500
                            try {
                                // @ts-ignore: TS2554
                                return browser.manage().addCookie({name: "ngapimockid", value: ngapimockid});
                            } catch (error) {
                                // Fallback protractor < 5.0.0
                                return browser.manage().addCookie('ngapimockid', ngapimockid);
                            }
                        });
                    }
                });
            }

            if (config.SELENIUM_PROMISE_MANAGER === false) {
                this._handleRequest = (httpMethod, urlSuffix, opts, errorMessage) => {
                    return new promise.Promise((resolve, reject) => {
                        request(httpMethod, this._baseUrl + urlSuffix, opts).done((res) => {
                            return res.statusCode === 200 ? resolve(undefined) : reject(errorMessage);
                        });
                    });
                }
            }
        });
    }

    selectScenario(data: string | { name: string; expression: string; method: string }, scenario: string) {
        return this._execute('PUT', '/mocks', {
            identifier: this._getIdentifier(data),
            scenario: scenario || null
        }, 'Could not select scenario [' + scenario + ']');
    }

    delayResponse(data: string | { name: string; expression: string; method: string }, delay: number) {
        return this._execute('PUT', '/mocks', {
            identifier: this._getIdentifier(data),
            delay: delay || 0
        }, 'Could not delay the response');
    }

    setAllScenariosToDefault() {
        return this._execute('PUT', '/mocks/defaults', undefined, 'Could not set scenarios to default');
    }

    setAllScenariosToPassThrough() {
        return this._execute('PUT', '/mocks/passthroughs', undefined, 'Could not set scenarios to passthroughs');
    }

    private _execute(httpMethod: 'PUT', urlSuffix: string, options: {}, errorMessage: string) {
        const opts: { headers: {}; json?: {}; } = {
            headers: {
                'Content-Type': 'application/json',
                'ngapimockid': ngapimockid
            },
        };

        if (options !== undefined) {
            opts.json = options;
        }

        return this._handleRequest(httpMethod, urlSuffix, opts, errorMessage);
    }

    private _getIdentifier(data: string | { name: string; expression: string; method: string }) {
        let identifier;
        if (typeof data === 'string') { // name of the mock
            identifier = data;
        } else if (data.name) { // the data containing the name of the mock
            identifier = data.name;
        } else {
            identifier = data.expression + '$$' + data.method;
        }
        return identifier;
    }

}

hooker.hook(browser, 'get', {
    once: true,
    post: function (result) {
        return result.then(function () {
            // Since protractor 5.0.0 the addCookie is an object, see
            // https://github.com/angular/protractor/blob/master/CHANGELOG.md#500
            try {
                // @ts-ignore: TS2554
                return browser.manage().addCookie({name: 'ngapimockid', value: ngapimockid});
            } catch (error) {
                // Fallback protractor < 5.0.0
                return browser.manage().addCookie('ngapimockid', ngapimockid);
            }
        }).then(() => {
          browser.refresh();
        });
    }
});

export { browser }

export default new NgWsApiMock();
