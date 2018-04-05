import GetMocksHandler from '../getMocksHandler';
import {selectors, State} from '../../../store/index';
import {Store} from 'rxjs-reselect';

import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';

/** Handler that takes care of getting all the mocks for runtime. */
class RuntimeGetMocksHandler extends GetMocksHandler {
    /** @inheritDoc */
    getSelections(): Observable<{ [key: string]: string }> {
        return this._registry.select(selectors.getRuntimeSelections);
    }

    /** @inheritDoc */
    getDelays(): Observable<{ [key: string]: number }> {
        return this._registry.select(selectors.getRuntimeDelays);
    }
}

export default RuntimeGetMocksHandler;
