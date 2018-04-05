import NgApimockHandler from '../ngApimockHandler';
import {selectors, State} from '../store/index';
import {Store} from 'rxjs-reselect';
import {Observable} from 'rxjs/Observable';
import {Add, Remove, SocketActionTypes} from '../store/actions/sockets';
import {Socket} from '../store/reducers/sockets';

/** Handler for a request for protractor. */
class ProtractorNgApimockHandler extends NgApimockHandler {
    getSockets(ngApimockId?: string): Observable<Socket[]> {
        return this._registry.select(selectors.getProtractorSocketEntities)
            .map(sockets => [sockets[ngApimockId]])
    }

    /** @inheritDoc */
    getSelection(identifier: string, ngApimockId: string): Observable<string> {
        return this._registry.select(selectors.getProtractorSelections)
            .filter(selections => !!selections[ngApimockId])
            .map(selections => selections[ngApimockId][identifier]);
    }

    /** @inheritDoc */
    getDelay(identifier: string, ngApimockId: string): Observable<number> {
        return this._registry.select(selectors.getProtractorDelays)
            .filter(delays => !!delays[ngApimockId])
            .map(delays => delays[ngApimockId][identifier]);
    }

    addSocket(socket: Socket, ngApimockId: string): void {
        this._registry.dispatch({
            type: SocketActionTypes.Add,
            socket,
            ngApimockId
        });
        this._socketAdded$.next({socket, ngApimockId});
    }

    removeSocket(socket: Socket, ngApimockId: string): void {
        this._registry.dispatch({
            type: SocketActionTypes.Remove,
            socket,
            ngApimockId
        });
        this._socketRemoved$.next({socket, ngApimockId});
    }

}

export default ProtractorNgApimockHandler;
