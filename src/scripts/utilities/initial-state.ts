import { CalculatorState, INITIAL_STATE, calculatorStackSchema } from '../data/calculator-state.interface';
import { LOCAL_STORAGE_STATE_KEY } from '../data/constants';
import Joi from 'joi';


export function getInitialState(): CalculatorState[] {

    const saved = window.localStorage.getItem(LOCAL_STORAGE_STATE_KEY);

    if (saved) {
        const parsed = JSON.parse(saved);
        const { error, value } = calculatorStackSchema.validate(parsed);
        if (!error && value != undefined) {
            return value;
        }
        window.localStorage.removeItem(LOCAL_STORAGE_STATE_KEY);
    }
    return [INITIAL_STATE];

}
