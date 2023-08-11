import { tokens } from '../data/tokens';
import { useKeyboardListener } from '../hooks/use-keyboard-listener';
import { useRipple } from '../hooks/use-ripple';
import { InputToken } from '../types/token.interface';
import { Button } from './Button';
import { ButtonClickEvent } from '../types/button-click-event';

export interface KeyBoardProps {
  tokenNames: Array<keyof typeof tokens>;
  onClick: (token: InputToken) => void;
}

export function KeyBoard({ tokenNames, onClick }: KeyBoardProps) {
  useKeyboardListener(tokenNames, clickHandler);

  const [ripples, addRipple] = useRipple();

  function clickHandler(event: ButtonClickEvent) {
    onClick(tokens[event.buttonId]);
    addRipple(event);
  }

  const buttons = tokenNames.map(tokenName => {
    return (
      <Button
        key={tokenName}
        tokenName={tokenName}
        onClick={clickHandler}
        ripples={ripples.filter(ripple => ripple.buttonId === tokenName)}
      />
    );
  });

  return (
    <div
      id="input"
      className="h-4/5 framed grid grid-cols-4 grid-rows-6 gap-2 p-2"
    >
      {buttons}
    </div>
  );
}
