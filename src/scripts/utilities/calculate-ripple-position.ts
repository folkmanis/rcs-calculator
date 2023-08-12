import { RippleEvent } from '../types/ripple-event';
import { RippleStyle } from '../types/ripple-style';

export function calculateRipplePosition(
    container: DOMRect,
    ripple: RippleEvent
): RippleStyle {
    const diameter = Math.max(container.width, container.height);
    const radius = diameter / 2;
    const clientX = ripple.clientX ?? container.x + container.width / 2;
    const clientY = ripple.clientY ?? container.y + container.height / 2;
    return {
        width: `${diameter}px`,
        height: `${diameter}px`,
        left: `${clientX - (container.x + radius)}px`,
        top: `${clientY - (container.y + radius)}px`,
    };
}
