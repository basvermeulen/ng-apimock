import ResetMocksToDefaultsHandler from '../resetMocksToDefaultsHandler';
import {selectors, State} from '../../../store/index';
import {Store} from 'rxjs-reselect';
import {Observable} from 'rxjs/Observable';
import {SelectionActionTypes} from '../../../store/actions/selections';

/** Handler that takes care of resetting the mocks to defaults for runtime. */
class RuntimeResetMocksToDefaultsHandler extends ResetMocksToDefaultsHandler {
    /** @inheritDoc */
    resetToDefaults(): void {
        this._registry.dispatch({
            type: SelectionActionTypes.ClearAll
        });
    }

    /** @inheritDoc */
    getSelections(ngApimockId?: string): Observable<{ [key: string]: string }> {
        return this._registry.select(selectors.getRuntimeSelections);
    }
}

export default RuntimeResetMocksToDefaultsHandler;
