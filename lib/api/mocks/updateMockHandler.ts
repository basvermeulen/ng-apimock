import * as http from 'http';
import {httpHeaders} from '../../http';
import Handler from '../../handler';
import {Store} from 'rxjs-reselect';
import {selectors, State} from '../../store/index';
import {first} from 'rxjs/operators/first';
import {map} from 'rxjs/operators/map';
import {Subject} from 'rxjs/Subject';

import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import {Observable} from 'rxjs/Observable';
import {Socket} from '../../store/reducers/sockets';

/** Abstract Handler for Updating mock state. */
abstract class UpdateMockHandler implements Handler {

    protected _scenarioSelected$ = new Subject<{ identifier: string; scenario: string; ngApimockId?: string }>();

    constructor(protected _registry: Store<State>) {

        const sockets$: Observable<{runtime: Socket[]; protractor: {[index: string]: Socket}}> = Observable.combineLatest(
            this._registry.select(selectors.getProtractorSocketEntities),
            this._registry.select(selectors.getRuntimeSockets)
        ).map(([protractor, runtime]) => ({runtime, protractor}));

        this._scenarioSelected$
            .switchMap(({identifier, scenario, ngApimockId}) => {
                return this._registry.select(selectors.getMockEntities)
                    .map((mocks) => {
                        return {
                            response: mocks[identifier].responses[scenario],
                            ngApimockId
                        };
                    });
            })
            .withLatestFrom(sockets$)
            .subscribe(([{response, ngApimockId}, allSockets]) => {
                const sockets = ngApimockId ? [allSockets.protractor[ngApimockId]] : allSockets.runtime;

                sockets
                    .filter(socket => socket && socket.readyState === socket.OPEN)
                    .forEach((socket) => {
                        socket.send(JSON.stringify(response.data));
                    });
            });

    }

    /**
     * Handle the passthrough selection.
     * @param registry The registry.
     * @param identifier The mock identifier.
     * @param ngApimockId The ngApimock id.
     */
    abstract handlePassThroughScenario(identifier: string, ngApimockId?: string): void;

    /**
     * Handle the scenario selection.
     * @param registry The registry.
     * @param identifier The mock identifier.
     * @param ngApimockId The ngApimock id.
     */
    abstract handleScenarioSelection(identifier: string, scenario: string, ngApimockId?: string): void;

    /**
     * Handle the delay.
     * @param registry The registry.
     * @param identifier The mock identifier.
     * @param delay The delay in millis.
     * @param ngApimockId The ngApimock id.
     */
    abstract handleDelay(identifier: string, delay: number, ngApimockId?: string): void;

    /**
     * @inheritDoc
     *
     * Handler that takes care of updating the settings for a mock.
     *
     * The following updates are available:
     * - select a scenario
     * - toggle echo state
     * - delay the mock response
     */
    handleRequest(request: http.IncomingMessage, response: http.ServerResponse, next: Function,
                  ngApimockId: string): void {
        const requestDataChunks: Buffer[] = [];

        request.on('data', (rawData: Buffer) => {
            requestDataChunks.push(rawData);
        });

        request.on('end', () => {
            const data = JSON.parse(Buffer.concat(requestDataChunks).toString());

            const identifier = data.identifier;

            const mock$ = this._registry.select(selectors.getMockEntities)
                .pipe(first(), map(mocks => mocks[identifier]));

            mock$.subscribe((mock) => {
                if (mock) {
                    if (this.isScenarioSelectionRequest(data)) {
                        if (this.isPassThroughScenario(data.scenario)) {
                            this.handlePassThroughScenario(data.identifier, ngApimockId);
                        } else if (mock.responses[data.scenario]) {
                            this.handleScenarioSelection(data.identifier, data.scenario, ngApimockId);
                        } else {
                            throw new Error('No scenario matching name [' + data.scenario + '] found');
                        }
                    } else if (this.isDelayResponseRequest(data)) {
                        this.handleDelay(data.identifier, data.delay, ngApimockId);
                    }

                    response.writeHead(200, httpHeaders.CONTENT_TYPE_APPLICATION_JSON);
                    response.end();
                } else {
                    response.writeHead(409, httpHeaders.CONTENT_TYPE_APPLICATION_JSON);
                    response.end(JSON.stringify({
                        message: 'No mock matching identifier [' + data.identifier + '] found'
                    }, ['message']));
                }
            });
        });
    }


    /**
     * Indicates if the request to wants to select a scenario.
     * @param data The request data.
     * @returns {boolean} indicator The indicator.
     */
    private isScenarioSelectionRequest(data: any): boolean {
        return data.scenario !== undefined;
    }

    /**
     * Indicates if the given request wants to delay a response.
     * @param data The request data.
     * @returns {boolean} indicator The indicator.
     */
    private isDelayResponseRequest(data: any): boolean {
        return data.delay !== undefined;
    }

    /**
     * Indicates if the given scenario represents passThrough.
     * @param scenario The scenario.
     * @returns {boolean} indicator The indicator.
     */
    private isPassThroughScenario(scenario: string): boolean {
        return scenario === null || scenario === 'passThrough';
    }
}

export default UpdateMockHandler;
