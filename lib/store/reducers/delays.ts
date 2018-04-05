import {AnyAction, Reducer} from 'redux';
import {DelayActions, DelayActionTypes} from '../actions/delays';
import {SelectionActionTypes} from '../actions/selections';

export {DelayActions as Actions}

export interface DelayState {
    runtime: {
        [id: string]: number;
    }
    protractor: {
        [ngApimockId: string]: {
            [id: string]: number;
        }
    }
}

const initialState: DelayState = {
    runtime: {},
    protractor: {}
};

export function reducer(state = initialState, action: AnyAction) {
    switch (action.type) {
        case DelayActionTypes.Delay:
            const {runtime, protractor} = state;
            const {identifier, delay, ngApimockId} = action;
            return {
                runtime: ngApimockId ? runtime : {...runtime, [identifier]: delay},
                protractor: ngApimockId ? {...protractor, [ngApimockId]: {...protractor[ngApimockId], [identifier]: delay}} : protractor
            };
        default:
            return state;
    }
}
