import parse from 'html-react-parser';
import { MouseEventHandler } from 'react';
import { BUTTON_ID_PREFIX } from '../data/constants';
import { tokens } from '../data/tokens';
import { Ripple } from './Ripple';
import { ActiveRipple } from '../types/active-ripple';
import { ButtonClickEvent } from '../types/button-click-event';

export interface ButtonProps {
  tokenName: keyof typeof tokens;
  onClick: (event: ButtonClickEvent) => void;
  ripples: ActiveRipple[];
}

export function Button({ tokenName, onClick, ripples }: ButtonProps) {
  const token = tokens[tokenName];
  const elementId = BUTTON_ID_PREFIX + tokenName;
  const classes = ['framed', 'key-button', ...(token.styles ?? [])].join(' ');

  const clickHandler: MouseEventHandler<HTMLButtonElement> = ev => {
    ev.stopPropagation();
    onClick({
      buttonId: tokenName,
      clientX: ev.clientX,
      clientY: ev.clientY,
    });
  };

  return (
    <div className={classes} id={elementId}>
      <button onClick={clickHandler}>
        {parse(token.html)}
        <Ripple ripples={ripples} />
      </button>
    </div>
  );
}
