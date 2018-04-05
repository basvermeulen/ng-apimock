import {Action as ReduxAction, AnyAction} from 'redux';
import {MockModel} from '../../model/mock';

export const MockActionTypes = {
    Add: '[Mock] Add',
    Update: '[Mock] Update',
    Remove: '[Mock] Remove',
};

export abstract class Action implements AnyAction {
    abstract type: any;
}

export class Add implements AnyAction {
    readonly type = MockActionTypes.Add;
    constructor(public mock: MockModel) {}
}

export class Update implements AnyAction {
    readonly type = MockActionTypes.Update;
    constructor() {}
}

export class Remove implements AnyAction {
    readonly type = MockActionTypes.Remove;
    constructor() {}
}

export type MockActions = Add | Update | Remove;
