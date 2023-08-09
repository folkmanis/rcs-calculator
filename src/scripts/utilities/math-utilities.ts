/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { FunctionToken, MathToken, NumberToken, OperatorToken } from '../types/token.interface';

type TokenActions = {
    [key in 'number' | 'function' | 'operator' | '(' | ')']:
    (operatorStack: MathToken[], outputStack: MathToken[], token: MathToken) => void
};

type RpnTokens = NumberToken | OperatorToken | FunctionToken;

export const last = <T>(arr: T[]): T | undefined => arr[arr.length - 1];

export function evaluateTokens(tokens: MathToken[]): number {

    const rpnStack = tokensToRpnStack(tokens);

    return rpnStackToResult(rpnStack);

}


const tokenActions: TokenActions = {
    'number': (_, outputStack, token) => outputStack.push(token),
    'function': (operatorStack, _, token) => operatorStack.push(token),
    'operator': (operatorStack, outputStack, token) => {
        token = token as OperatorToken;
        while (
            last(operatorStack)?.type === 'operator'
            && ((last(operatorStack) as OperatorToken).precedence > token.precedence
                || (
                    (last(operatorStack) as OperatorToken).precedence === token.precedence
                    && token.associativity === 0
                )
            )
        ) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            outputStack.push(operatorStack.pop()!);
        }
        operatorStack.push(token);
    },
    '(': (operatorStack, _, token) => operatorStack.push(token),
    ')': (operatorStack, outputStack, _) => {
        if (operatorStack.length === 0) {
            throw new Error('Invalid expression. Parentheses mismatch');
        }
        while (last(operatorStack)?.type !== '(') {
            outputStack.push(operatorStack.pop()!);
            if (operatorStack.length === 0) {
                throw new Error('Invalid expression. Parentheses mismatch');
            }
        }
        operatorStack.pop();
        if (last(operatorStack)?.type === 'function') {
            outputStack.push(operatorStack.pop()!);
        }
    },

};

type RpnActions = Record<'number' | 'function' | 'operator', (stack: number[], token: MathToken) => void>;
const rpnOperatorActions: RpnActions = {
    'number': (stack, token) => stack.push((token as NumberToken).value),
    'operator': (stack, token) => {
        const arg2 = stack.pop()!;
        const arg1 = stack.pop()!;
        stack.push((token as OperatorToken).callback(arg1, arg2));
    },
    'function': (stack, token) => {
        const arg = stack.pop()!;
        stack.push((token as FunctionToken).callback(arg));
    },
};


export function tokensToRpnStack(tokens: MathToken[]): RpnTokens[] {

    const operatorStack: MathToken[] = [];
    const outputStack: RpnTokens[] = [];

    tokens.forEach(token => { tokenActions[token.type](operatorStack, outputStack, token); });

    if (operatorStack.some(token => token.type === '(')) {
        throw new Error('Invalid expression. Parentheses mismatch');
    }

    assertIsRpnStack(operatorStack);

    return outputStack.concat(operatorStack.reverse());

}

function assertIsRpnStack(tokens: MathToken[]): asserts tokens is RpnTokens[] {
    if (tokens.some(token => token.type === '(')) {
        throw new Error('Invalid expression. Parentheses mismatch');
    }
}


export function rpnStackToResult(tokens: RpnTokens[]): number {
    return tokens
        .reduce<number[]>((stack, token) => {
            rpnOperatorActions[token.type](stack, token);
            return stack;
        }, [])
        .pop()!;
}
