export type TokenType = 'reset' | "(" | ")" | "operator" | "digit" | "function" | "exec" | "number" | "undo";

export enum Associativity {
    LEFT, RIGHT
}

export interface TokenBase {
    type: TokenType,
}

export interface ButtonToken extends TokenBase {
    html: string,
    keycodes?: string[],
    styles?: string[],
}

export interface OperatorToken extends ButtonToken {
    type: "operator",
    precedence: number,
    associativity: Associativity,
    callback: (a: number, b: number) => number,
}

export interface FunctionToken extends ButtonToken {
    type: "function",
    callback: (a: number) => number,
}

export interface DigitToken extends ButtonToken {
    type: 'digit',
    value: string,
}

export interface OpeningBracketToken extends ButtonToken {
    type: '(',
}

export interface ClosingBracketToken extends ButtonToken {
    type: ')',
}

export interface ExecToken extends ButtonToken {
    type: 'exec',
}

export interface ResetToken extends ButtonToken {
    type: 'reset',
}

export interface NumberToken extends TokenBase {
    type: 'number',
    value: number,
    html: string,
}

export interface UndoToken extends ButtonToken {
    type: 'undo',
}

export type InputToken = OperatorToken | FunctionToken | DigitToken | OpeningBracketToken | ClosingBracketToken | ExecToken | ResetToken | UndoToken;

export type MathToken = NumberToken | OperatorToken | FunctionToken | OpeningBracketToken | ClosingBracketToken;