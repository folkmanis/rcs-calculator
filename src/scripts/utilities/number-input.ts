import { InputToken, MathToken } from '../data/token.interface';
import { MAX_DIGITS } from '../data/constants';

export function inputToMathToken(value: string): MathToken {
    return {
        type: 'number',
        value: +value,
        html: value,
    };
}

export function addTokenToInput(initialValue: string, token: InputToken): string {

    if (initialValue.length >= MAX_DIGITS) {
        return initialValue;
    }

    if (token.type !== 'digit') {
        return initialValue;
    }

    const digit = token.value;

    if (digit === '-') {
        return negateInput(initialValue);
    }
    if (digit === "." && !initialValue.includes(".")) {
        return initialValue + ".";
    }
    if (digit.match(/\d{1}/)) {
        let result = initialValue;
        if (+initialValue === 0 && !initialValue.includes(".")) {
            result = result.replace('0', '');
        }
        result += digit;
        return result;
    }
    return initialValue;
}

export function negateInput(value: string): string {
    if (value[0] === '-') {
        return value.slice(1);
    } else {
        return '-' + value;
    }
}
