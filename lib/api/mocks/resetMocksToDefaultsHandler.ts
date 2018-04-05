import * as http from 'http';
import {httpHeaders} from '../../http';
import Handler from '../../handler';
import {Store} from 'rxjs-reselect';
import {selectors, State} from '../../store/index';
import {Observable} from 'rxjs/Observable';

/** Abstract Handler for Resetting mocks to defaults. */
abstract class ResetMocksToDefaultsHandler implements Handler {

    constructor(protected _registry: Store<State>) {
    }

    /**
     * Resets the selections to defaults.
     * @param registry The registry.
     * @param ngApimockId The ngApimock id.
     */
    abstract resetToDefaults(ngApimockId?: string): void;

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
     * Handler that takes care of resetting the mocks to defaults.
     */
    handleRequest(request: http.IncomingMessage, response: http.ServerResponse, next: Function,
                  ngApimockId: string): void {
        this.resetToDefaults(ngApimockId);
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

export default ResetMocksToDefaultsHandler;
