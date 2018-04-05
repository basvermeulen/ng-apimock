import UpdateMockHandler from '../updateMockHandler';
import {Store} from 'rxjs-reselect';
import {State} from '../../../store/index';
import {Delay, DelayActionTypes} from '../../../store/actions/delays';
import {Select, SelectionActionTypes} from '../../../store/actions/selections';

/** Handler that takes care of updating the mock configuration for protractor. */
class ProtractorUpdateMockHandler extends UpdateMockHandler {
    /** @inheritDoc */
    handlePassThroughScenario(identifier: string, ngApimockId: string): void {
        this._registry.dispatch({
            type: SelectionActionTypes.Select,
            identifier,
            selection: null,
            ngApimockId
        });
    }

    /** @inheritDoc */
    handleScenarioSelection(identifier: string, scenario: string, ngApimockId: string): void {
        this._registry.dispatch({
            type: SelectionActionTypes.Select,
            identifier,
            selection: scenario,
            ngApimockId
        });
        this._scenarioSelected$.next({
            identifier,
            scenario,
            ngApimockId
        });
    }

    /** @inheritDoc */
    handleDelay(identifier: string, delay: number, ngApimockId?: string): void {
        this._registry.dispatch({
            type: DelayActionTypes.Delay,
            identifier,
            delay,
            ngApimockId
        });
    }

}

export default ProtractorUpdateMockHandler;
