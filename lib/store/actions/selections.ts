import {Action, AnyAction} from 'redux';

export const SelectionActionTypes = {
    Select: '[Selection] Select',
    ClearAll: '[Selection] ClearAll',
    Update: '[Selection] Update',
    Remove: '[Selection] Remove',
};

export class Select implements AnyAction {
    readonly type = SelectionActionTypes.Select;
    constructor(public identifier: string, public selection: string, public ngApimockId?: string) {}
}

export class ClearAll implements AnyAction {
    readonly type = SelectionActionTypes.ClearAll;
    constructor(public ngApimockId?: string) {}
}

export class Update implements AnyAction {
    readonly type = SelectionActionTypes.Update;
    constructor() {}
}

export class Remove implements AnyAction {
    readonly type = SelectionActionTypes.Remove;
    constructor() {}
}

export type SelectionActions = Select | ClearAll | Update | Remove;
