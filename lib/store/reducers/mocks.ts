import {AnyAction, Reducer as ReduxReducer} from 'redux';
import {MockActions, MockActionTypes} from '../actions/mocks';

import {MockModel} from '../../model/mock';

export {MockActions as Actions}

export interface MockState {
    ids: string[];
    entities: {
        [id: string]: MockModel;
    }
}

const initialState: MockState = {
    ids: [],
    entities: {}
};

export function reducer(state = initialState, action: AnyAction) {

    switch (action.type) {
        case MockActionTypes.Add:
            const mock = action.mock;
            const {ids, entities} = state;
            const found = state.ids.some(id => id === mock.identifier);

            return {
                ids: found ? ids : [...ids, mock.identifier],
                entities: {
                    ...entities,
                    [mock.identifier]: mock
                }
            };
        default:
            return state;
    }
}
