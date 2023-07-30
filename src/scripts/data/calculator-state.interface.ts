import { resetButton } from './token-utilities';
import { InputToken, MathToken } from './token.interface';


export interface CalculatorState {
    numberInput: string,
    buttonStack: InputToken[],
    tokenStack: MathToken[],
    errorState?: Error,
    result?: number,
}

export const INITIAL_STATE: CalculatorState = {
    numberInput: "0",
    buttonStack: [resetButton],
    tokenStack: []
};