import { useRef } from 'react';
import { tokens } from '../data/tokens';
import { useKeyboardListener } from '../hooks/use-keyboard-listener';
import { Button, ButtonHandle } from './Button';
import { RippleEvent } from '../types/ripple-event';

export interface KeyBoardProps {
  tokenNames: Array<keyof typeof tokens>;
  onClick: (buttonId: string) => void;
}

export function KeyBoard({ tokenNames, onClick }: KeyBoardProps) {
  function clickEventHandler(buttonId: string, ev?: RippleEvent) {
    buttonsRef.current.get(buttonId)?.ripple?.addRipple(ev);
    onClick(buttonId);
  }
  useKeyboardListener(tokenNames, clickEventHandler);
  const buttonsRef = useRef<Map<string, ButtonHandle | null>>(new Map());

  const buttons = tokenNames.map(tokenName => (
    <Button
      key={tokenName}
      tokenName={tokenName}
      onClick={ev => {
        clickEventHandler(tokenName, ev);
      }}
      ref={el => buttonsRef.current.set(tokenName, el)}
    />
  ));

  return (
    <div
      id="input"
      className="h-4/5 framed grid grid-cols-4 grid-rows-6 gap-2 p-2"
    >
      {buttons}
    </div>
  );
}
