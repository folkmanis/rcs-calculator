import { CalculatorState, INITIAL_STATE } from '../data/calculator-state.interface';
import { LOCAL_STORAGE_STATE_KEY } from '../data/constants';

export function getInitialState(): CalculatorState {
    const saved = window.localStorage.getItem(LOCAL_STORAGE_STATE_KEY);
    if (saved) {
        return JSON.parse(saved);
    } else {
        return INITIAL_STATE;
    }
}
