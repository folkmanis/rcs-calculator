import { InputToken, MathToken } from '../data/token.interface';
import { MAX_DIGITS } from '../data/constants';

export function inputToMathToken(value: string): MathToken {
    return {
        type: 'number',
        value: +value,
        html: value,
    };
}

export function addTokenToInput(value: string, token: InputToken): string {

    if (value.length >= MAX_DIGITS) {
        return value;
    }

    if (token.type !== 'digit') {
        return value;
    }

    const digit = token.value;

    if (digit === '-') {
        return negateInput(value);
    }
    if (digit === "." && !value.includes(".")) {
        return value + ".";
    }
    if (digit.match(/\d{1}/)) {
        let result = value;
        if (+value === 0 && !value.includes(".")) {
            result = result.replace('0', '');
        }
        result += digit;
        return result;
    }
    return value;
}

export function negateInput(value: string): string {
    if (value[0] === '-') {
        return value.slice(1);
    } else {
        return '-' + value;
    }
}
