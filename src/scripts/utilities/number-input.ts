import { InputToken, MathToken } from '../types/token.interface';
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
    if (digit === '.' && !initialValue.includes('.')) {
        return initialValue + '.';
    }
    if (digit.match(/\d{1}/) != null) {
        let result = initialValue;
        if (+initialValue === 0 && !initialValue.includes('.')) {
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


// TODO - refactor to fine-tune output
export function inputStringToDisplay(value: string): string {
    let output = value.toString();
    if (output.length > MAX_DIGITS && output.includes('.')) {
        output = (+output).toPrecision(MAX_DIGITS - 2);
    }

    output = output.replace('.', ',');

    return output;
}
