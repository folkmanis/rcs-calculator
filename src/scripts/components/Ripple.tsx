import { forwardRef, useImperativeHandle, useRef } from 'react';
import '../../styles/ripple.css';
import { useRipple } from '../hooks/use-ripple';
import { RippleEvent } from '../types/ripple-event';

export interface RippleHandle {
  addRipple: (event?: RippleEvent) => void;
}

export const Ripple = forwardRef<RippleHandle, unknown>(function Ripple(
  _,
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [rippleArray, addRipple] = useRipple(containerRef.current);

  useImperativeHandle(ref, () => ({
    addRipple,
  }));

  return (
    <div className="ripple-container" ref={containerRef}>
      {rippleArray.map((ripple, idx) => (
        <span key={idx} style={ripple}></span>
      ))}
    </div>
  );
});
