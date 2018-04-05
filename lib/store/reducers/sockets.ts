import {AnyAction} from 'redux';
import {SocketActions, SocketActionTypes} from '../actions/sockets';

export {SocketActions as Actions}

export type Socket = any;

export interface SocketState {
    runtime: Socket[]
    protractor: {
        ids: string[];
        entities: {
            [ngApimockId: string]: Socket;
        }
    }
}

const initialState: SocketState = {
    runtime: [],
    protractor: {
        ids: [],
        entities: {}
    }
};

export function reducer(state = initialState, action: AnyAction) {
    switch (action.type) {
        case SocketActionTypes.Add: {
            const {runtime, protractor} = state;
            const {socket, ngApimockId} = action;
            return {
                runtime: ngApimockId ? runtime : [...runtime, socket],
                protractor: ngApimockId ? {
                    ids: [...protractor.ids.filter(id => id !== ngApimockId), ngApimockId],
                    entities: {
                        ...protractor.entities,
                        [ngApimockId]: socket
                    }
                } : protractor
            };
        }
        case SocketActionTypes.Remove: {
            const {runtime, protractor} = state;
            const {socket, ngApimockId} = action;
            return {
                runtime: ngApimockId ? runtime : [...runtime, socket],
                protractor: ngApimockId ? {
                    ids: protractor.ids.filter(id => id !== ngApimockId),
                    entities: {
                        ...protractor.entities,
                        [ngApimockId]: undefined
                    }
                } : protractor
            };
        }
        default:
            return state;
    }
}
