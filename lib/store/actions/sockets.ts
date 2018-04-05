import {Action, AnyAction} from 'redux';

export const SocketActionTypes = {
    Add: '[Socket] Add',
    Remove: '[Socket] Remove',
};

export class Add implements AnyAction {
    readonly type = SocketActionTypes.Add;
    constructor(public socket: any, public ngApimockId?: string) {}
}

export class Remove implements AnyAction {
    readonly type = SocketActionTypes.Remove;
    constructor(public socket: any, public ngApimockId?: string) {}
}

export type SocketActions = Add | Remove;
