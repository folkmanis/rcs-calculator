import '../../styles/ripple.css';
import { MouseEventHandler, useLayoutEffect, useState } from 'react';

interface RippleStyle {
  width: string;
  height: string;
  left: string;
  top: string;
}
export function Ripple() {
  const [rippleArray, setRippleArray] = useState<RippleStyle[]>([]);

  useLayoutEffect(() => {
    let timeoutId: number | undefined;
    if (rippleArray.length > 0) {
      timeoutId = setTimeout(() => {
        setRippleArray([]);
        clearTimeout(timeoutId);
      }, 300 * 5);
    }
    return () => clearTimeout(timeoutId);
  }, [rippleArray]);

  const addRipple: MouseEventHandler<HTMLDivElement> = event => {
    const element = event.currentTarget.getBoundingClientRect();
    const diameter = Math.max(element.width, element.height);
    const radius = diameter / 2;
    const newRipple: RippleStyle = {
      width: `${diameter}px`,
      height: `${diameter}px`,
      left: `${event.clientX - (element.x + radius)}px`,
      top: `${event.clientY - (element.y + radius)}px`,
    };
    setRippleArray([...rippleArray, newRipple]);
  };

  return (
    <div className="ripple-container" onMouseDown={addRipple}>
      {rippleArray.map((ripple, idx) => (
        <span key={idx} style={ripple}></span>
      ))}
    </div>
  );
}
