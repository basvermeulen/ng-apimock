import {Subject} from 'rxjs/Subject';

interface Mock {
    // the identifier.
    identifier: string;
    // either name or expression + $$ + method
    request: object | { $ref: any };
    // the name of the module
    name?: string;
    // type of response object either
    isArray?: boolean;
    // the expression
    $schema: string;
    // the available responses
    responses: { [key: string]: MockResponse };

    selectionChange$: Subject<string>;
}

export interface MockResponse {
    // response data
    data?: {} | [{}];
    // indicates this response is the default response
    default: boolean;
    // delay
    delay?: number;
}

export default Mock;
