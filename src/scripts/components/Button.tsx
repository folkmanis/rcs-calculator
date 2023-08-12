import parse from 'html-react-parser';
import {
  ElementRef,
  MouseEventHandler,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import { BUTTON_ID_PREFIX } from '../data/constants';
import { tokens } from '../data/tokens';
import { Ripple, RippleHandle } from './Ripple';

export interface ButtonProps {
  tokenName: keyof typeof tokens;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export interface ButtonHandle {
  ripple: RippleHandle | null;
}

export const Button = forwardRef<ButtonHandle, ButtonProps>(function Button(
  { tokenName, onClick }: ButtonProps,
  ref
) {
  const rippleRef = useRef<ElementRef<typeof Ripple>>(null);

  useImperativeHandle(ref, () => ({
    ripple: rippleRef.current,
  }));

  const { styles, html } = tokens[tokenName];
  const elementId = BUTTON_ID_PREFIX + tokenName;
  const classes = ['framed', 'key-button', ...(styles ?? [])].join(' ');

  return (
    <div className={classes} id={elementId}>
      <button onClick={onClick}>
        {parse(html)}
        <Ripple ref={rippleRef} />
      </button>
    </div>
  );
});
