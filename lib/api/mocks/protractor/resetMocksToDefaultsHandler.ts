import ResetMocksToDefaultsHandler from '../resetMocksToDefaultsHandler';

import {Observable} from 'rxjs/Observable';
import {selectors, State} from '../../../store/index';
import {Store} from 'rxjs-reselect';
import {SelectionActionTypes} from '../../../store/actions/selections';

/** Handler that takes care of resetting the mocks to defaults for protractor. */
class ProtractorResetMocksToDefaultsHandler extends ResetMocksToDefaultsHandler {
    /** @inheritDoc */
    resetToDefaults(ngApimockId: string): void {
        this._registry.dispatch({
            type: SelectionActionTypes.ClearAll,
            ngApimockId
        });
    }

    /** @inheritDoc */
    getSelections(ngApimockId: string): Observable<{ [key: string]: string }> {
        return this._registry.select(selectors.getProtractorSelections)
            .map(selections => selections[ngApimockId]);
    }
}

export default ProtractorResetMocksToDefaultsHandler;
