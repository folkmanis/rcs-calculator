import { useEffect, useRef } from 'react';
import { tokensToKeyMap } from '../utilities/token-utilities';
import { tokens } from '../data/tokens';
import { ButtonClickEvent } from '../types/button-click-event';

export function useKeyboardListener(
    inputTokenIds: Array<keyof typeof tokens>,
    inputHandler: (event: ButtonClickEvent) => void
): void {
    const savedHandler = useRef<(ev: KeyboardEvent) => void>();

    useEffect(() => {
        const keyMap = tokensToKeyMap(inputTokenIds);
        savedHandler.current = (ev: KeyboardEvent) => {
            const buttonId = keyMap.get(ev.key);
            if (buttonId !== undefined) {
                ev.preventDefault();
                inputHandler({ buttonId });
            }
        };
    }, [inputTokenIds, inputHandler]);

    useEffect(() => {
        const eventListener = (ev: KeyboardEvent) => { savedHandler.current?.(ev); };
        document.addEventListener('keydown', eventListener);

        return () => {
            document.removeEventListener('keydown', eventListener);
        };
    }, []);
}
