import { useLayoutEffect, useMemo, useState } from 'react';
import { RippleEvent } from '../types/ripple-event';
import { RippleStyle } from '../types/ripple-style';
import { calculateRipplePosition } from '../utilities/calculate-ripple-position';

export function useRipple(
    containerRef: HTMLDivElement | null
): [RippleStyle[], (event?: RippleEvent) => void] {
    const [rippleEvents, setRippleEvents] = useState<RippleEvent[]>([]);

    useLayoutEffect(() => {
        let timeoutId: number | undefined;
        if (rippleEvents.length > 0) {
            timeoutId = setTimeout(() => {
                setRippleEvents([]);
                clearTimeout(timeoutId);
            }, 300 * 5);
        }
        return () => {
            clearTimeout(timeoutId);
        };
    }, [rippleEvents]);

    const addRipple: (event?: RippleEvent) => void = event => {
        setRippleEvents([...rippleEvents, event ?? {}]);
    };

    const rippleArray = useMemo<RippleStyle[]>(() => {
        if (containerRef !== null) {
            const element = containerRef.getBoundingClientRect();
            return rippleEvents.map(ripple =>
                calculateRipplePosition(element, ripple)
            );
        } else {
            return [];
        }

    }, [containerRef, rippleEvents]);

    return [rippleArray, addRipple];
}
