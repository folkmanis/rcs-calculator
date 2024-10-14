import { produce } from 'immer';
import { MAX_UNDO_LEVELS } from '../data/constants';
import { tokens } from '../data/tokens';
import { CalculatorState, INITIAL_STATE } from '../types/calculator-state.interface';
import { DigitToken, FunctionToken, InputToken, MathToken, OpeningBracketToken, OperatorToken } from '../types/token.interface';
import { evaluateTokens, last } from './math-utilities';
import { addTokenToInput, inputToMathToken } from './number-input';

type SequenceFn = (state: CalculatorState, currrentButton: InputToken) => void | CalculatorState | null;

type SequenceMatrix = {
    [key in InputToken['type']]: Record<string, SequenceFn>
};

export function processButtonClick(
    stateStack: CalculatorState[],
    buttonId: string
): CalculatorState[] {

    const currrentButton = tokens[buttonId];
    if (currrentButton.type === 'undo') {
        if (stateStack.length > 1) {
            return produce(stateStack, draft => {
                draft.pop();
            });
        }
        return stateStack;
    }

    const lastState = last(stateStack);
    if (lastState === undefined) {
        return stateStack;
    }
    const { previousButton } = lastState;
    const action = sequenceMatrix[previousButton.type]?.[currrentButton.type];

    if (typeof action === 'function') {

        const updatedState = updateState(lastState, currrentButton, action);
        if (updatedState !== lastState) {
            return produce(stateStack, draft => {
                if (stateStack.length >= MAX_UNDO_LEVELS) {
                    draft.shift();
                }
                draft.push(updatedState);
            });
        }
    }

    return stateStack;

}

function updateState(lastState: CalculatorState, currrentButton: InputToken, sequenceFn: SequenceFn): CalculatorState {

    const updatedState = produce(lastState, draft => {
        delete draft.errorState;
        const result = sequenceFn(draft, currrentButton);
        if (result === null) {
            return lastState;
        }
        if (result !== undefined) {
            return result;
        }
        draft.previousButton = currrentButton;
    });

    return updatedState;

}


const reset: SequenceFn = () => ({ ...INITIAL_STATE });

const calculateResult = (state: CalculatorState) => {
    try {
        const result = evaluateTokens(state.tokenStack);
        if (isNaN(result)) {
            state.errorState = new Error('Invalid expression');
            delete state.result;
        } else {
            state.numberInput = result.toString();
            state.result = result;
        }
    } catch (error) {
        state.errorState = error as Error;
        delete state.result;
    }
};

const calculateIntermediateResult = (state: CalculatorState) => {
    try {
        const result = evaluateTokens(state.tokenStack);
        if (!isNaN(result)) {
            state.numberInput = result.toString();
        }
    } catch (error) {
    }
};

const addTokenToState: SequenceFn = (state: CalculatorState, currrentButton: InputToken) => {
    state.tokenStack.push(currrentButton as MathToken & InputToken);
};

const addDigitToState: SequenceFn = (state: CalculatorState, currrentButton: InputToken) => {

    const numberUpdate = addTokenToInput(
        state.numberInput,
        currrentButton as DigitToken
    );
    if (state.numberInput !== numberUpdate) {
        state.numberInput = numberUpdate;
    } else {
        return null;
    }
};

// previous -> next
const sequenceMatrix: SequenceMatrix = {

    'reset': {
        'digit': addDigitToState,
        'operator': (state, currrentButton) => {
            state.tokenStack.push(
                inputToMathToken(state.numberInput),
                currrentButton as MathToken
            );
        },
        'function': addTokenToState,
        '(': addTokenToState,
    },
    'exec': {
        'reset': reset,
        'digit': (state, currrentButton) => {
            state.numberInput = addTokenToInput('0', currrentButton as DigitToken);
            state.tokenStack = [];
            delete state.result;
        },
        'operator': (state, currrentButton) => {
            state.tokenStack = [inputToMathToken(state.numberInput), currrentButton as OperatorToken];
            delete state.result;
        },
        'function': (_, currrentButton) => ({
            ...INITIAL_STATE,
            tokenStack: [currrentButton as FunctionToken],
        }),
        '(': (_, currrentButton) => ({
            ...INITIAL_STATE,
            tokenStack: [currrentButton as OpeningBracketToken],
        }),
    },
    'digit': {
        'reset': reset,
        'exec': (state, _) => {
            state.tokenStack.push(inputToMathToken(state.numberInput));
            calculateResult(state);
        },
        'digit': addDigitToState,
        'operator': (state, currrentButton) => {
            state.tokenStack.push(inputToMathToken(state.numberInput));
            calculateIntermediateResult(state);
            addTokenToState(state, currrentButton);
        },
        ')': (state, currrentButton) => {
            const button = currrentButton as MathToken & InputToken;
            state.tokenStack.push(inputToMathToken(state.numberInput));
            state.tokenStack.push(button);
            state.numberInput = '0';
            calculateIntermediateResult(state);
        },
    },
    'operator': {
        'reset': reset,
        'digit': (state, currrentButton) => {
            state.numberInput = '0';
            return addDigitToState(state, currrentButton);
        },
        'function': addTokenToState,
        '(': (state, currrentButton) => {
            const button = currrentButton as MathToken & InputToken;
            state.tokenStack.push(button);
            state.numberInput = '0';
        },
    },
    'function': {
        'reset': reset,
        'digit': (state, currrentButton) => {
            state.numberInput = '0';
            return addDigitToState(state, currrentButton);
        },
        'function': addTokenToState,
        '(': addTokenToState,
    },
    '(': {
        'reset': reset,
        'digit': (state, currrentButton) => {
            state.numberInput = '0';
            return addDigitToState(state, currrentButton);
        },
        'function': addTokenToState,
        '(': addTokenToState,
    },
    ')': {
        'reset': reset,
        'exec': calculateResult,
        'operator': addTokenToState,
        ')': addTokenToState,
    },
    'undo': {},
};
