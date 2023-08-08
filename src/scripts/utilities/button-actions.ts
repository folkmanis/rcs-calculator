import { produce } from "immer";
import { CalculatorState, INITIAL_STATE } from '../types/calculator-state.interface';
import { MAX_UNDO_LEVELS } from '../data/constants';
import { DigitToken, FunctionToken, InputToken, MathToken, OpeningBracketToken, OperatorToken } from '../types/token.interface';
import { evaluateTokens, last } from './math-utilities';
import { addTokenToInput, inputToMathToken } from './number-input';


type SequenceFn = (state: CalculatorState, currrentButton: InputToken) => CalculatorState;

type SequenceMatrix = {
    [key in InputToken['type']]: Record<string, SequenceFn>
};

export function processButtonClick(stateStack: CalculatorState[], currrentButton: InputToken): CalculatorState[] {

    if (currrentButton.type === 'undo') {
        if (stateStack.length > 1) {
            return produce(stateStack, draft => {
                draft.pop();
            });
        }
        return stateStack;
    }

    const lastState = last(stateStack);
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

    const updatedState = sequenceFn({ ...lastState, errorState: undefined }, currrentButton);

    if (updatedState === lastState) {
        return lastState;
    }

    return produce(updatedState, draft => {
        draft.previousButton = currrentButton;
    });

}


const reset: SequenceFn = () => INITIAL_STATE;

const calculateResult = (state: CalculatorState) => produce(state, draft => {
    try {
        const result = evaluateTokens(state.tokenStack);
        if (isNaN(result)) {
            draft.errorState = new Error('Invalid expression');
            delete draft.result;
        } else {
            draft.numberInput = result.toString();
            draft.result = result;
        }
    } catch (error) {
        draft.errorState = error as Error;
        delete draft.result;
    }
});

const calculateIntermediateResult = (state: CalculatorState) => produce(state, draft => {
    try {
        const result = evaluateTokens(state.tokenStack);
        if (!isNaN(result)) {
            draft.numberInput = result.toString();
        }
    } catch (error) {
    }
});

const addTokenToState = (state: CalculatorState, currrentButton: InputToken) => produce(state, draft => {
    const button = currrentButton as MathToken & InputToken;
    draft.tokenStack.push(button);
});

const addDigitToState = (state: CalculatorState, currrentButton: InputToken) => {

    const numberUpdate = addTokenToInput(
        state.numberInput,
        currrentButton as DigitToken);

    if (state.numberInput !== numberUpdate) {
        return produce(state, draft => {
            draft.numberInput = numberUpdate;
        });
    }
    return state;
};

// previous -> next
const sequenceMatrix: SequenceMatrix = {

    'reset': {
        'digit': addDigitToState,
        'operator': (state, currrentButton) => produce(state, draft => {
            draft.tokenStack.push(inputToMathToken(state.numberInput));
            draft.tokenStack.push(currrentButton as MathToken);
        }),
        'function': addTokenToState,
        '(': addTokenToState,
    },
    'exec': {
        'reset': reset,
        'digit': (state, currrentButton) => produce(state, draft => {
            const button = currrentButton as DigitToken;
            draft.numberInput = addTokenToInput('0', button);
            draft.tokenStack = [];
            delete draft.result;
        }),
        'operator': (state, currrentButton) => produce(state, draft => {
            const button = currrentButton as OperatorToken;
            draft.tokenStack = [inputToMathToken(state.numberInput), button];
            delete draft.result;
        }),
        'function': (state, currrentButton) => {
            const button = currrentButton as FunctionToken;
            const resetState = reset(state, currrentButton);
            return produce(resetState, draft => {
                draft.tokenStack.push(button);
            });
        },
        '(': (state, currrentButton) => {
            const resetState = reset(state, currrentButton);
            resetState.tokenStack.push(currrentButton as OpeningBracketToken);
            return resetState;
        },
    },
    'digit': {
        'reset': reset,
        'exec': (state, _) => {
            const updatedState = produce(state, draft => {
                draft.tokenStack.push(inputToMathToken(state.numberInput));
            });
            return calculateResult(updatedState);
        },
        'digit': addDigitToState,
        'operator': (state, currrentButton) => {
            const updatedState = produce(state, draft => {
                draft.tokenStack.push(inputToMathToken(state.numberInput));
            });
            return addTokenToState(
                calculateIntermediateResult(updatedState),
                currrentButton
            );
        },
        ')': (state, currrentButton) => {
            const updatedState = produce(state, draft => {
                draft.tokenStack.push(inputToMathToken(state.numberInput));

                const button = currrentButton as MathToken & InputToken;
                draft.tokenStack.push(button);
                draft.numberInput = "0";

            });
            return calculateIntermediateResult(updatedState);
        },
    },
    'operator': {
        'reset': reset,
        'digit': (state, currrentButton) => {
            const updatedState = produce(state, draft => {
                draft.numberInput = '0';
            });
            return addDigitToState(updatedState, currrentButton);
        },
        'function': addTokenToState,
        '(': (state, currrentButton) => produce(state, draft => {
            const button = currrentButton as MathToken & InputToken;
            draft.tokenStack.push(button);
            draft.numberInput = "0";
        }),
    },
    'function': {
        'reset': reset,
        'digit': (state, currrentButton) => {
            const updatedState = produce(state, draft => {
                draft.numberInput = '0';
            });
            return addDigitToState(updatedState, currrentButton);
        },
        'function': addTokenToState,
        '(': addTokenToState,
    },
    '(': {
        'reset': reset,
        'digit': (state, currrentButton) => {
            const updatedState = produce(state, draft => {
                draft.numberInput = '0';
            });
            return addDigitToState(updatedState, currrentButton);
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


