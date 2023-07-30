import { InputToken } from './token.interface';
import { buttons } from './tokens';

export function tokensToKeyMap(tokens: InputToken[]): Map<string, InputToken> {
    const keyMap = new Map<string, InputToken>();
    tokens.forEach(token => {
        token.keycodes && token.keycodes.forEach(keyCode => {
            keyMap.set(keyCode, token);
        });
    });
    return keyMap;
}

export const resetButton = buttons.find(button => button.type === 'reset')!;