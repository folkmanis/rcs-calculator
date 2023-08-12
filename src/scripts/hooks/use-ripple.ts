import { useLayoutEffect, useState } from 'react';
import { ActiveRipple } from '../types/active-ripple';

export function useRipple(): [ActiveRipple[], (ripple: ActiveRipple) => void] {
    const [rippleArray, setRippleArray] = useState<ActiveRipple[]>([]);

    useLayoutEffect(() => {
        let timeoutId: number | undefined;
        if (rippleArray.length > 0) {
            timeoutId = setTimeout(() => {
                setRippleArray([]);
                clearTimeout(timeoutId);
            }, 300 * 5);
        }
        return () => {
            clearTimeout(timeoutId);
        };
    }, [rippleArray]);

    const addRipple: (ripple: ActiveRipple) => void = ripple => {
        setRippleArray([...rippleArray, ripple]);
    };

    return [rippleArray, addRipple];
}
