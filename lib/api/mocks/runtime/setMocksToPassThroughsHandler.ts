import SetMocksToPassThroughsHandler from '../setMocksToPassThroughsHandler';
import {selectors, State} from '../../../store/index';
import {Store} from 'rxjs-reselect';
import {Observable} from 'rxjs/Observable';

/** Handler that takes care of setting the mocks to passThroughs for runtime. */
class RuntimeSetMocksToPassThroughsHandler extends SetMocksToPassThroughsHandler {
    /** @inheritDoc */
    setToPassThroughs(ngApimockId?: string): void {

    }

    /** @inheritDoc */
    getSelections(): Observable<{ [key: string]: string }> {
        return this._registry.select(selectors.getRuntimeSelections);
    }
}

export default RuntimeSetMocksToPassThroughsHandler;
