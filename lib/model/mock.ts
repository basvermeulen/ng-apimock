import {Response} from './response';

export interface MockModel {
    request: {} | { $ref: any };
    identifier: string;
    name: string;
    responses: {
        [selection: string]: Response
    };
    isArray: boolean;
}

export interface Mock extends MockModel {
    selection: any;
}
