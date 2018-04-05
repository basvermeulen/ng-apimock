import Mock from '../tasks/mock';
import * as http from 'http';

import {httpMethods} from './http';
import ProtractorGetMocksHandler from './api/mocks/protractor/getMocksHandler';
import RuntimeGetMocksHandler from './api/mocks/runtime/getMocksHandler';
import ProtractorSetMocksToPassThroughsHandler from './api/mocks/protractor/setMocksToPassThroughsHandler';
import ProtractorResetMocksToDefaultsHandler from './api/mocks/protractor/resetMocksToDefaultsHandler';
import RuntimeResetMocksToDefaultsHandler from './api/mocks/runtime/resetMocksToDefaultsHandler';
import RuntimeSetMocksToPassThroughsHandler from './api/mocks/runtime/setMocksToPassThroughsHandler';
import registry, {selectors} from './store/index';
import ProtractorUpdateMockHandler from './api/mocks/protractor/updateMockHandler';
import RuntimeUpdateMockHandler from './api/mocks/runtime/updateMockHandler';
import ProtractorNgApimockHandler from './protractor/ngApimockHandler';
import RuntimeNgApimockHandler from './runtime/ngApimockHandler';
import PUT = httpMethods.PUT;
import GET = httpMethods.GET;
import {WebSocketServerResponse} from './ngApimockHandler';
import {Subject} from 'rxjs/Subject';
import {Add, Add as AddMock, MockActionTypes} from './store/actions/mocks';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/map';
import {MockModel} from './model/mock';
import {Observable} from 'rxjs/Observable';

const sha1 = require('sha1');
const JsonRefs = require('json-refs');

(function () {
    'use strict';

    (module).exports = {
        ngApimockRequest: ngApimockRequest,
        registerMocks: registerMocks,
        updateMock: updateMock
    };

    const handlers = {
        protractor: {
            updateMockHandler: new ProtractorUpdateMockHandler(registry),
            getMocksHandler: new ProtractorGetMocksHandler(registry),
            resetMocksToDefaultsHandler: new ProtractorResetMocksToDefaultsHandler(registry),
            setMocksToPassThroughsHandler: new ProtractorSetMocksToPassThroughsHandler(registry),
            ngApimockHandler: new ProtractorNgApimockHandler(registry)
        },
        runtime: {
            updateMockHandler: new RuntimeUpdateMockHandler(registry),
            getMocksHandler: new RuntimeGetMocksHandler(registry),
            resetMocksToDefaultsHandler: new RuntimeResetMocksToDefaultsHandler(registry),
            setMocksToPassThroughsHandler: new RuntimeSetMocksToPassThroughsHandler(registry),
            ngApimockHandler: new RuntimeNgApimockHandler(registry)
        }
    };

    /**
     * The connect middleware for handeling the mocking
     * @param request The http request.
     * @param response The http response.
     * @param next The next middleware.
     */
    function ngApimockRequest(request: http.IncomingMessage, response: http.ServerResponse, next: Function): void {
        const ngapimockId = _ngApimockId(request.headers),
            type = ngapimockId !== undefined ? 'protractor' : 'runtime';

        if (request.url === '/ngapimock/mocks' && request.method === GET) {
            handlers[type].getMocksHandler.handleRequest(request, response, next, ngapimockId);
        } else if (request.url === '/ngapimock/mocks' && request.method === PUT) {
            handlers[type].updateMockHandler.handleRequest(request, response, next, ngapimockId);
        } else if (request.url === '/ngapimock/mocks/defaults' && request.method === PUT) {
            handlers[type].resetMocksToDefaultsHandler.handleRequest(request, response, next, ngapimockId);
        } else if (request.url === '/ngapimock/mocks/passthroughs' && request.method === PUT) {
            handlers[type].setMocksToPassThroughsHandler.handleRequest(request, response, next, ngapimockId);
        } else {
            handlers[type].ngApimockHandler.handleRequest(request, response as WebSocketServerResponse, next, ngapimockId);
        }
    }

    /**
     * Registers the given mocks.
     * @param mocks The mocks.
     */
    function registerMocks(mocks: Mock[]) {
        return Promise.all(
            mocks.map(mock => {
                return _handleMock(mock, `Mock with identifier '%s' already exists. Overwriting existing mock.`);
            })
        );
    }

    /**
     * Update the given mock.
     * @param mock The mock.
     */
    function updateMock(mock: Mock) {
        return _handleMock(mock, `Mock with identifier '%s' already exists. Updating existing mock.`);
    }

    function _handleMock(mock: Mock, warning: string) {
        return JsonRefs.resolveRefs(mock)
            .then(({resolved}: {resolved: {resolved: MockModel}}) => {
                const mock = resolved.resolved;
                const hash = sha1(JSON.stringify(mock));

                // Give mock identification for fast retrieval
                mock.identifier = mock.name;

                const found$: Observable<boolean> = registry.select(selectors.getMockEntities)
                    .first()
                    .map((mocks: { [index: string]: MockModel }) => !!mocks[mock.identifier]);

                found$.subscribe(() => {
                    console.warn(warning, mock.identifier);
                });

                registry.dispatch({
                    type: MockActionTypes.Add,
                    mock
                });
            });
    }

    /**
     * Get the ngApimockId.
     * @param headers The request headers.
     * @returns {*}
     */
    function _ngApimockId(headers: any) {
        let ngApimockId;
        const header = headers.ngapimockid,
            cookie = _getNgApimockIdCookie(headers.cookie);

        if (header !== undefined) {
            ngApimockId = header;
        } else if (cookie !== undefined) {
            ngApimockId = cookie;
        }
        return ngApimockId;
    }

    /**
     * Get the ngApimockId from the given cookies.
     * @param cookies The cookies.
     * @returns {*}
     */
    function _getNgApimockIdCookie(cookies: string) {
        return cookies && cookies
            .split(';')
            .map(cookie => {
                const parts = cookie.split('=');
                return {
                    key: parts.shift().trim(),
                    value: decodeURI(parts.join('='))
                };
            })
            .filter(cookie => cookie.key === 'ngapimockid')
            .map(cookie => cookie.value)[0];
    }
})();
