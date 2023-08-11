import { CalculatorState, INITIAL_STATE } from '../types/calculator-state.interface';

export const lastStateOrDefault = (arr: CalculatorState[]): CalculatorState => {
    const lastItem = arr[arr.length - 1];
    return lastItem === undefined ? INITIAL_STATE : lastItem;
};
