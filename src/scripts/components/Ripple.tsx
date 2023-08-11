import { useRef } from 'react';
import '../../styles/ripple.css';
import { RippleStyle } from '../types/ripple-style';
import { RipplePosition } from '../types/ripple-position';

interface RippleProps {
  ripples: RipplePosition[];
}

export function Ripple({ ripples }: RippleProps) {
  const rippleArray: RippleStyle[] = [];
  const containerRef = useRef<HTMLDivElement>(null);

  const element = containerRef.current?.getBoundingClientRect();
  if (element !== undefined) {
    const diameter = Math.max(element.width, element.height);
    const radius = diameter / 2;
    ripples.forEach(ripple => {
      const clientX = ripple.clientX ?? element.x + element.width / 2;
      const clientY = ripple.clientY ?? element.y + element.height / 2;
      const newRipple: RippleStyle = {
        width: `${diameter}px`,
        height: `${diameter}px`,
        left: `${clientX - (element.x + radius)}px`,
        top: `${clientY - (element.y + radius)}px`,
      };
      rippleArray.push(newRipple);
    });
  }

  return (
    <div className="ripple-container" ref={containerRef}>
      {rippleArray.map((ripple, idx) => (
        <span key={idx} style={ripple}></span>
      ))}
    </div>
  );
}
