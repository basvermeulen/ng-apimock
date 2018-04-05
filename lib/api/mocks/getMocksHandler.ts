import * as http from 'http';
import {httpHeaders} from '../../http';
import Handler from '../../handler';
import {selectors, State} from '../../store/index';
import {Store} from 'rxjs-reselect';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/observable/combineLatest';

/** Abstract Handler for Getting the mocks. */
abstract class GetMocksHandler implements Handler {

    constructor(protected _registry: Store<State>) {
    }

    /**
     * Gets the selections.
     * @param registry The registry.
     * @param ngApimockId The ngApimock id.
     * @return selections The selections.
     */
    abstract getSelections(ngApimockId?: string): Observable<{ [key: string]: string }>;

    /**
     * Gets the selections.
     * @param registry The registry.
     * @param ngApimockId The ngApimock id.
     * @return selections The selections.
     */
    abstract getDelays(ngApimockId?: string): Observable<{ [key: string]: number }>;


    /**
     * @inheritDoc
     *
     * Handler that takes care of getting all the mocks.
     */
    handleRequest(request: http.IncomingMessage, response: http.ServerResponse, next: Function,
                  ngApimockId: string): void {
        const mocks$ = this._registry.select(selectors.getMocks).first();
        const selections$ = this.getSelections(ngApimockId).first();
        const delays$ = this.getDelays(ngApimockId).first();

        Observable.combineLatest(
            mocks$,
            selections$,
            delays$
        ).subscribe(([mocks, selections, delays]) => {
            response.writeHead(200, httpHeaders.CONTENT_TYPE_APPLICATION_JSON);
            response.end(JSON.stringify({
                mocks,
                selections,
                delays,
            }));
        });
    }
}

export default GetMocksHandler;
