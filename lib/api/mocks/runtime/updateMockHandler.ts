import UpdateMockHandler from '../updateMockHandler';
import {Store} from 'rxjs-reselect';

import {Select, SelectionActionTypes} from '../../../store/actions/selections';
import {Delay, DelayActionTypes} from '../../../store/actions/delays';
import {State} from '../../../store/index';

/** Handler that takes care of updating the mock configuration for runtime. */
class RuntimeUpdateMockHandler extends UpdateMockHandler {
    /** @inheritDoc */
    handlePassThroughScenario(identifier: string): void {
        this._registry.dispatch({
            type: SelectionActionTypes.Select,
            identifier,
            selection: null
        });
    }

    /** @inheritDoc */
    handleScenarioSelection(identifier: string, scenario: string): void {
        this._registry.dispatch({
            type: SelectionActionTypes.Select,
            identifier,
            selection: scenario
        });
        this._scenarioSelected$.next({
            identifier,
            scenario
        });
    }

    /** @inheritDoc */
    handleDelay(identifier: string, delay: number): void {
        this._registry.dispatch({
            type: DelayActionTypes.Delay,
            identifier,
            delay
        });
    }
}

export default RuntimeUpdateMockHandler;
