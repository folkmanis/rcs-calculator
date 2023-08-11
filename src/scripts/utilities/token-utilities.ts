import { tokens } from '../data/tokens';

export function tokensToKeyMap(tokenIds: Array<keyof typeof tokens>): Map<string, string> {
    const keyMap = new Map<string, string>();
    tokenIds.forEach(id => {
        tokens[id].keycodes?.forEach(keyCode => {
            keyMap.set(keyCode, id);
        });
    });
    return keyMap;
}
