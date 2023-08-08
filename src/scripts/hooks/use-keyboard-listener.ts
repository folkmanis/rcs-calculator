import { useEffect, useRef } from 'react';
import { InputToken } from '../types/token.interface';
import { tokensToKeyMap } from '../utilities/token-utilities';

export function useKeyboardListener(
    handler: (ev: InputToken) => void,
    inputTokens: InputToken[]
) {
    const savedHandler = useRef<(ev: KeyboardEvent) => void>(() => { });

    useEffect(() => {
        const keyMap = tokensToKeyMap(inputTokens);
        savedHandler.current = (ev: KeyboardEvent) => {
            const token = keyMap.get(ev.key);
            if (token) {
                ev.preventDefault();
                handler(token);
            }
        };
    }, [handler, inputTokens]);

    useEffect(() => {
        const eventListener = (ev: KeyboardEvent) => savedHandler.current(ev);
        document.addEventListener('keydown', eventListener);

        return () => {
            document.removeEventListener('keydown', eventListener);
        };
    }, []);
}

