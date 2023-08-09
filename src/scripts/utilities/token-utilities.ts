import { InputToken } from '../types/token.interface';
import { buttons } from '../data/tokens';

export function tokensToKeyMap(tokens: InputToken[]): Map<string, InputToken> {
    const keyMap = new Map<string, InputToken>();
    tokens.forEach(token => {
        token.keycodes?.forEach(keyCode => {
            keyMap.set(keyCode, token);
        });
    });
    return keyMap;
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const resetButton = buttons.find(button => button.type === 'reset')!;
