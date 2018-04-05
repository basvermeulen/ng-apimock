import * as http from 'http';
import {httpHeaders} from '../../http';
import Handler from '../../handler';
import {Store} from 'rxjs-reselect';
import {Observable} from 'rxjs/Observable';
import {selectors, State} from '../../store/index';

/** Abstract Handler for setting the mocks to passThroughs. */
abstract class SetMocksToPassThroughsHandler implements Handler {

    constructor(protected _registry: Store<State>) {
    }


    /**
     * Sets the selections to passThroughs.
     * @param registry The registry.
     * @param ngApimockId The ngApimock id.
     */
    abstract setToPassThroughs(ngApimockId?: string): void;

    /**
     * Gets the selections.
     * @param registry The registry.
     * @param ngApimockId The ngApimock id.
     * @return selections The selections.
     */
    abstract getSelections(ngApimockId?: string): Observable<{ [key: string]: string }>;


    /**
     * @inheritDoc
     *
     * Handler that takes care of setting the mocks to passThroughs.
     */
    handleRequest(request: http.IncomingMessage, response: http.ServerResponse, next: Function,
                  ngApimockId: string): void {
        this.setToPassThroughs(ngApimockId);

        const mocks$ = this._registry.select(selectors.getMocks).first();
        const selections$ = this.getSelections(ngApimockId).first();

        Observable.combineLatest(
            mocks$,
            selections$
        ).subscribe(([mocks, selections]) => {
            response.writeHead(200, httpHeaders.CONTENT_TYPE_APPLICATION_JSON);
            response.end(JSON.stringify({
                mocks,
                selections
            }));
        });
    }
}

export default SetMocksToPassThroughsHandler;
