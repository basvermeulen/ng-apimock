import { ActionsObservable } from 'redux-observable';
import {Action, MiddlewareAPI, Store} from 'redux';
import {Observable} from 'rxjs/Observable';
import {Add, SocketActionTypes} from '../actions/sockets';
import {selectors, State} from '../index';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/ignoreElements';

export const socketEpic = (action$: ActionsObservable<Action>, store: MiddlewareAPI<State>): Observable<Action> => {
    return action$
        .ofType(SocketActionTypes.Add)
        .do((action: Add) => {
            // const state = store.getState();
            // const mocks = selectors.getMocks(state);

            // client.on('message', (message: any) => {
            //     const match = this.getMatchingMock(registry.mocks.toArray(), JSON.parse(message));
            //
            //     if (match) {
            //         this.emitResponse(registry, match, ngApimockId);
            //     }
            // });
            //
            // client.on('close', () => {
            //     this.removeSocket(registry, client, ngApimockId);
            // });

        })
        .ignoreElements();
};
