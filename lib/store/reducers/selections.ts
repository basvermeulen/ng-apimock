import {AnyAction} from 'redux';
import {ClearAll, SelectionActions, SelectionActionTypes} from '../actions/selections';

export {SelectionActions as Actions}

export interface SelectionState {
    runtime: {
        [id: string]: string;
    }
    protractor: {
        [ngApimockId: string]: {
            [id: string]: string;
        }
    }
}

const initialState: SelectionState = {
    runtime: {},
    protractor: {}
};

export function reducer(state = initialState, action: AnyAction) {
    const {runtime, protractor} = state;
    switch (action.type) {
        case SelectionActionTypes.Select: {
            const {identifier, selection, ngApimockId} = action;
            return {
                runtime: ngApimockId ? runtime : {...runtime, [identifier]: selection},
                protractor: ngApimockId ? {...protractor, [ngApimockId]: {...protractor[ngApimockId], [identifier]: selection}} : protractor
            };
        }
        case SelectionActionTypes.ClearAll: {
            const {ngApimockId} = action;
            return {
                runtime: ngApimockId ? runtime : {},
                protractor: ngApimockId ? {} : protractor
            };
        }
        default:
            return state;
    }
}
