import { LOCAL_STORAGE_STATE_KEY } from '../data/constants';
import { CalculatorState, INITIAL_STATE, calculatorStackSchema } from '../types/calculator-state.interface';


export function getInitialState(): CalculatorState[] {

    const saved = window.localStorage.getItem(LOCAL_STORAGE_STATE_KEY);

    if (typeof saved === 'string') {
        const parsed: unknown = JSON.parse(saved);
        const { error, value } = calculatorStackSchema.validate(parsed);
        if ((error == null) && value !== undefined) {
            return value;
        }
        window.localStorage.removeItem(LOCAL_STORAGE_STATE_KEY);
    }
    return [INITIAL_STATE];

}
