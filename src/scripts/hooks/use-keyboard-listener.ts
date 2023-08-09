import { useEffect, useRef } from 'react';
import { InputToken } from '../types/token.interface';
import { tokensToKeyMap } from '../utilities/token-utilities';

const noop = (): void => { };

export function useKeyboardListener(
    handler: (ev: InputToken) => void,
    inputTokens: InputToken[]
): void {
    const savedHandler = useRef<(ev: KeyboardEvent) => void>(noop);

    useEffect(() => {
        const keyMap = tokensToKeyMap(inputTokens);
        savedHandler.current = (ev: KeyboardEvent) => {
            const token = keyMap.get(ev.key);
            if (token != null) {
                ev.preventDefault();
                handler(token);
            }
        };
    }, [handler, inputTokens]);

    useEffect(() => {
        const eventListener = (ev: KeyboardEvent) => { savedHandler.current(ev); };
        document.addEventListener('keydown', eventListener);

        return () => {
            document.removeEventListener('keydown', eventListener);
        };
    }, []);
}
