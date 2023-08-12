import { useEffect, useRef } from 'react';
import { tokensToKeyMap } from '../utilities/token-utilities';
import { tokens } from '../data/tokens';

export function useKeyboardListener(
    inputTokenIds: Array<keyof typeof tokens>,
    inputHandler: (buttonId: string) => void
): void {
    const savedHandler = useRef<(ev: KeyboardEvent) => void>();

    useEffect(() => {
        const keyMap = tokensToKeyMap(inputTokenIds);
        savedHandler.current = (ev: KeyboardEvent) => {
            const buttonId = keyMap.get(ev.key);
            if (buttonId !== undefined) {
                ev.preventDefault();
                inputHandler(buttonId);
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
