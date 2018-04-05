import * as http from 'http';
import * as fs from 'fs-extra';
import * as url from 'url';
import * as WebSocket from 'ws';
import {Mock} from './model/mock';
import {httpHeaders} from './http';
import {Validator} from 'jsonschema';
import Handler from './handler';
import {selectors, State} from './store/index';
import {Store} from 'rxjs-reselect';
import {Observable} from 'rxjs/Observable';
import {Socket} from './store/reducers/sockets';
import {Add} from './store/actions/sockets';
import {Subject} from 'rxjs/Subject';

import 'rxjs/add/operator/first';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/combineLatest';

export interface WebSocketServerResponse extends http.ServerResponse {
    websocket: (client: any) => void;
}

/** Abstract Handler for a request. */
abstract class NgApimockHandler implements Handler {

    private _schemaValidator = new Validator();
    protected _socketAdded$ = new Subject<{ socket: Socket; ngApimockId?: string; }>();
    protected _socketRemoved$ = new Subject<{ socket: Socket; ngApimockId?: string; }>();

    constructor(protected _registry: Store<State>) {
        // Listen for new connections.
        this._socketAdded$.subscribe(({socket, ngApimockId}) => {
            socket.on('message', (message: any) => {
                this.getMatchingMock(JSON.parse(message))
                    .first()
                    .subscribe((mock) => {
                        if (mock) {
                            this.emitResponse(mock, ngApimockId);
                        }
                    });
            });

            socket.on('close', () => {
                this.removeSocket(socket, ngApimockId);
            });
        });
    }

    /**
     * Gets the selection.
     * @param identifier The mock identifier.
     * @param ngApimockId The ngApimock id.
     * @return selection The selection.
     */
    abstract getSelection(identifier: string, ngApimockId: string): Observable<string>;

    /**
     * Get the sockets.
     * @param ngApimockId The ngApimock id.
     * @return sockets The sockets.
     */
    abstract getSockets(ngApimockId?: string): Observable<Socket[]>;

    /**
     * Gets the delay in millis.
     * @param identifier The mock identifier.
     * @param ngApimockId The ngApimock id.
     * @return delay The delay.
     */
    abstract getDelay(identifier: string, ngApimockId: string): Observable<number>;

    abstract addSocket(socket: Socket, ngApimockId: string): void;

    abstract removeSocket(socket: Socket, ngApimockId: string): void;

    private isWebsocketUpgradeRequest(request: http.IncomingMessage): boolean {
        const {headers} = request;
        return headers.connection === 'Upgrade' || headers.upgrade === 'websocket';
    }


    /**
     * @inheritDoc
     *
     * Handler that takes care of request.
     *
     * The following requests are available:
     * - a normal api call
     * - a record call
     */
    handleRequest(request: http.IncomingMessage, response: WebSocketServerResponse, next: Function, ngApimockId: string): void {
        if (this.isWebsocketUpgradeRequest(request) && response.websocket) {
            response.websocket((client: any) => {
                this.addSocket(client, ngApimockId);
            });
        } else {
            next();
        }
    }

    emitResponse(mock: Mock, ngApimockId: string) {
        const response$ = this.getSelection(mock.identifier, ngApimockId)
            .first()
            .map(selection => mock.responses[selection]);

        const sockets$ = this.getSockets(ngApimockId);
        const variables = {};
        response$
            .withLatestFrom(sockets$)
            .subscribe(([response, sockets]) => {
            if (response) {
                const data = this.updateData(response.data, variables, (mock.isArray ? [] : {}));
                const delay = this.getDelay(mock.identifier, ngApimockId);

                sockets
                    .filter(socket => socket && socket.readyState === socket.OPEN)
                    .forEach((socket) => {
                    if (delay) {
                        setTimeout(() => {
                            socket.send(data);
                        }, delay);
                    } else {
                        socket.send(data);
                    }
                });
            }
        });
    }

    /**
     * Get the mock matching the given request.
     * @param mocks The mocks.
     * @param requestUrl The http request url.
     * @param method The http request method.
     * @returns matchingMock The matching mock.
     */
    getMatchingMock(request: any): Observable<Mock> {
        return this._registry.select(selectors.getMocks)
            .map((mocks: Mock[]) => {
                return mocks.find(({request: schema}) => {
                    return schema && this._schemaValidator.validate(request, schema).valid;
                });
            });
    }

    /**
     * Update the response data with the globally available variables.
     * @param data The data.
     * @param variables The variables.
     * @param defaults The defaults.
     * @return updatedData The updated data.
     */
    private updateData(data: any, variables: { [key: string]: string }, defaults: any): string {
        let _data: string;

        if (data !== undefined) {
            _data = JSON.stringify(data);
            Object.keys(variables).forEach(function (key) {
                if (variables.hasOwnProperty(key)) {
                    _data = _data.replace(new RegExp('%%' + key + '%%', 'g'), variables[key]);
                }
            });
        } else {
            _data = JSON.stringify(defaults);
        }
        return _data;
    }

}

export default NgApimockHandler;
