import {Action, AnyAction} from 'redux';

export const DelayActionTypes = {
    Delay: '[Delay] Delay',
};

export class Delay implements AnyAction {
    readonly type = DelayActionTypes.Delay;
    constructor(public identifier: string, public delay: number, public ngApimockId?: string) {}
}

export type DelayActions = Delay;
