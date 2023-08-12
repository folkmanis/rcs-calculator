import { useRef } from 'react';
import '../../styles/ripple.css';
import { RippleStyle } from '../types/ripple-style';
import { ActiveRipple } from '../types/active-ripple';
import { calculateRipplePosition } from '../utilities/calculate-ripple-position';

interface RippleProps {
  ripples: ActiveRipple[];
}

export function Ripple({ ripples }: RippleProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  let rippleArray: RippleStyle[] = [];
  if (containerRef.current !== null) {
    const element = containerRef.current.getBoundingClientRect();
    rippleArray = ripples.map(ripple =>
      calculateRipplePosition(element, ripple)
    );
  }

  return (
    <div className="ripple-container" ref={containerRef}>
      {rippleArray.map((ripple, idx) => (
        <span key={idx} style={ripple}></span>
      ))}
    </div>
  );
}
