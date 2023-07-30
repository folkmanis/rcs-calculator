import { produce } from "immer";
import { CalculatorState, INITIAL_STATE } from '../data/calculator-state.interface';
import { DigitToken, FunctionToken, InputToken, MathToken, OpeningBracketToken, OperatorToken } from '../data/token.interface';
import { evaluateTokens, last } from './math-utilities';
import { addTokenToInput, inputToMathToken } from './number-input';
import { resetButton } from '../data/token-utilities';


type SequenceFn = (state: CalculatorState, currrentButton: InputToken) => CalculatorState;

type SequenceMatrix = {
    [key in InputToken['type']]: Record<string, SequenceFn>
};

export function processButtonClick(state: CalculatorState, currrentButton: InputToken): CalculatorState {

    if (currrentButton.type === 'undo') {
        const buttonStack = state.buttonStack.slice(0, -1);
        return stateFromButtons(buttonStack);
    } else {
        state = produce(state, draft => {
            delete draft.errorState;
        });
        return updateStateAfterButtonClick(state, currrentButton);
    }

}

export function stateFromButtons(buttonStack: InputToken[]): CalculatorState {
    return buttonStack.reduce(
        (state, currrentButton) => processButtonClick(state, currrentButton),
        INITIAL_STATE
    );
}

function updateStateAfterButtonClick(state: CalculatorState, currrentButton: InputToken): CalculatorState {

    const { buttonStack } = state;
    const previousButton: InputToken = last(buttonStack) || { type: 'reset' };

    const action = currrentButton
        && previousButton
        && sequenceMatrix[previousButton.type]?.[currrentButton.type];
    if (typeof action === 'function') {
        const updatedState = action(state, currrentButton);
        return updatedState;
    } else {
        return state;
    }

}

const reset: SequenceFn = state => produce(state, draft => {
    draft.numberInput = "0";
    draft.buttonStack = [resetButton];
    draft.tokenStack = [];
    delete draft.errorState;
    delete draft.result;
});

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
        console.log(result);
        if (!isNaN(result)) {
            draft.numberInput = result.toString();
        }
    } catch (error) {
    }
});

const addTokenToState = (state: CalculatorState, currrentButton: InputToken) => produce(state, draft => {
    const button = currrentButton as MathToken & InputToken;
    draft.tokenStack.push(button);
    draft.buttonStack.push(button);
});

const addDigitToState = (state: CalculatorState, currrentButton: InputToken) => produce(state, draft => {
    const button = currrentButton as DigitToken;
    draft.numberInput = addTokenToInput(draft.numberInput, button);
    if (draft.numberInput !== state.numberInput) {
        draft.buttonStack.push(button);
    }
});

// previous -> next
const sequenceMatrix: SequenceMatrix = {

    'reset': {
        'reset': reset,
        'digit': addDigitToState,
        'operator': (state, currrentButton) => produce(state, draft => {
            draft.tokenStack.push(inputToMathToken(state.numberInput));
            draft = addTokenToState(state, currrentButton);
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
            draft.buttonStack.push(button);
        }),
        'operator': (state, currrentButton) => produce(state, draft => {
            const button = currrentButton as OperatorToken;
            draft.tokenStack = [inputToMathToken(state.numberInput), button];
            draft.buttonStack.push(button);
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
            const button = currrentButton as OpeningBracketToken;
            const resetState = reset(state, currrentButton);
            return produce(resetState, draft => {
                draft.tokenStack.push(button);
            });
        },
    },
    'digit': {
        'reset': reset,
        'exec': (state, currrentButton) => {
            const updatedState = produce(state, draft => {
                draft.tokenStack.push(inputToMathToken(state.numberInput));
                draft.buttonStack.push(currrentButton);
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
                draft.buttonStack.push(button);

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
            draft.buttonStack.push(button);
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


