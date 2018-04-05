import createStore, {Store} from 'rxjs-reselect';
import {AnyAction, Action, Store as ReduxStore, combineReducers, ReducersMapObject, MiddlewareAPI, applyMiddleware} from 'redux';

import * as fromMocks from './reducers/mocks';
import * as fromDelays from './reducers/delays';
import * as fromSelections from './reducers/selections';
import * as fromSockets from './reducers/sockets';

import {socketEpic} from './epics/socket';

import {createSelector} from 'reselect';
import {Mock, MockModel} from '../model/mock';
import {ActionsObservable, combineEpics, createEpicMiddleware, Epic} from 'redux-observable';

import {composeWithDevTools} from 'remote-redux-devtools';


export interface State {
    mocks: fromMocks.MockState;
    delays: fromDelays.DelayState;
    selections: fromSelections.SelectionState;
    sockets: fromSockets.SocketState;
}

export interface Reducers extends ReducersMapObject {
    mocks: (s: fromMocks.MockState, a: fromMocks.Actions) => fromMocks.MockState;
    delays: (s: fromDelays.DelayState, a: fromDelays.Actions) => fromDelays.DelayState;
    selections: (s: fromSelections.SelectionState, a: fromSelections.Actions) => fromSelections.SelectionState;
    sockets: (s: fromSockets.SocketState, a: fromSockets.Actions) => fromSockets.SocketState;
}

export const reducer = combineReducers<State>({
    mocks: fromMocks.reducer,
    delays: fromDelays.reducer,
    selections: fromSelections.reducer,
    sockets: fromSockets.reducer
});

export const epic = combineEpics(socketEpic);

const devToolsEnhancer = composeWithDevTools({
    name: 'Android app', realtime: true,
    hostname: 'localhost', port: 8000,
});
const epicMiddleware = createEpicMiddleware(epic);

export const store: Store<State> = createStore<State>(
    reducer,
    devToolsEnhancer(
        applyMiddleware(epicMiddleware)
    )
);
export default store;

const getMockIds = (state: State) => state.mocks.ids;
const getMockEntities = (state: State) => state.mocks.entities;

const getRuntimeSelections = (state: State) => state.selections.runtime;
const getProtractorSelections = (state: State) => state.selections.protractor;

const getRuntimeDelays = (state: State) => state.delays.runtime;
const getProtractorDelays = (state: State) => state.delays.protractor;

const getRuntimeSockets = (state: State) => state.sockets.runtime;
const getProtractorSocketIds = (state: State) => state.sockets.protractor.ids;
const getProtractorSocketEntities = (state: State) => state.sockets.protractor.entities;

const getProtractorSockets = createSelector(
    getProtractorSocketIds,
    getProtractorSocketEntities,
    (ids, entities) => ids.map(id => entities[id] as fromSockets.Socket) as fromSockets.Socket[]
);

const getSockets = createSelector(
    getRuntimeSockets,
    getProtractorSockets,
    (runtime: fromSockets.Socket[], protractor: fromSockets.Socket[]) => {
        return [...runtime, ...protractor].filter(_ => _.readyState === _.OPEN);
    }
);

const getMocks = createSelector(
    getMockIds,
    getMockEntities,
    (ids, entities) => ids.map(id => entities[id] as Mock) as Mock[]
);

export const selectors = {
    getMocks,
    getMockEntities,
    getRuntimeDelays,
    getProtractorDelays,
    getRuntimeSelections,
    getProtractorSelections,
    getRuntimeSockets,
    getProtractorSockets,
    getProtractorSocketEntities,
    getSockets
};
