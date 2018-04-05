import SetMocksToPassThroughsHandler from '../setMocksToPassThroughsHandler';
import {selectors, State} from '../../../store/index';
import {Store} from 'rxjs-reselect';
import {Observable} from 'rxjs/Observable';

/** Handler that takes care of setting the mocks to passThroughs for protractor. */
class ProtractorSetMocksToPassThroughsHandler extends SetMocksToPassThroughsHandler {
    /** @inheritDoc */
    setToPassThroughs(ngApimockId?: string): void {
    }

    /** @inheritDoc */
    getSelections(ngApimockId: string): Observable<{ [key: string]: string }> {
        return this._registry.select(selectors.getProtractorSelections)
            .map(selections => selections[ngApimockId]);
    }
}

export default ProtractorSetMocksToPassThroughsHandler;
