import GetMocksHandler from '../getMocksHandler';
import {selectors, State} from '../../../store/index';
import {Store} from 'rxjs-reselect';
import {Observable} from 'rxjs/Observable';

/** Handler that takes care of getting all the mocks for protractor. */
class ProtractorGetMocksHandler extends GetMocksHandler {
    /** @inheritDoc */
    getSelections(ngApimockId?: string): Observable<{ [key: string]: string }> {
        return this._registry.select(selectors.getProtractorSelections)
            .map(selections => selections[ngApimockId]);
    }

    /** @inheritDoc */
    getDelays(ngApimockId?: string): Observable<{ [key: string]: number }> {
        return this._registry.select(selectors.getProtractorDelays)
            .map(delays => delays[ngApimockId]);
    }
}

export default ProtractorGetMocksHandler;
