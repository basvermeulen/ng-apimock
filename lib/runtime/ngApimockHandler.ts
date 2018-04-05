import NgApimockHandler from '../ngApimockHandler';
import {selectors, State} from '../store/index';
import {Store} from 'rxjs-reselect';
import {Add, Remove, SocketActionTypes} from '../store/actions/sockets';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/operator/filter';
import {Socket} from '../store/reducers/sockets';

/** Handler for a request for runtime. */
class RuntimeNgApimockHandler extends NgApimockHandler {
    getSockets(): Observable<Socket[]> {
        return this._registry.select(selectors.getRuntimeSockets);
    }

    /** @inheritDoc */
    getSelection(identifier: string): Observable<string> {
        return this._registry.select(selectors.getRuntimeSelections)
            .map(selections => selections[identifier]);
    }

    /** @inheritDoc */
    getDelay(identifier: string): Observable<number> {
        return this._registry.select(selectors.getRuntimeDelays)
            .map(delays => delays[identifier]);
    }

    addSocket(socket: Socket): void {
        this._registry.dispatch({
            type: SocketActionTypes.Add,
            socket
        });
        this._socketAdded$.next({socket});
    }

    removeSocket(socket: Socket): void {
        this._registry.dispatch({
            type: SocketActionTypes.Remove,
            socket
        });
        this._socketRemoved$.next({socket});
    }
}

export default RuntimeNgApimockHandler;
