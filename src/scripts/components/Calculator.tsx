import { useEffect, useRef, useState } from 'react';
import { CalculatorState } from '../data/calculator-state.interface';
import { resetButton, tokensToKeyMap } from '../data/token-utilities';
import { InputToken } from '../data/token.interface';
import { buttons } from '../data/tokens';
import { processButtonClick } from '../utilities/button-actions';
import { KeyBoard } from './Keyboard';
import { Output } from './Output';

function useKeyboardListener(
  handler: (ev: InputToken) => void,
  inputTokens: InputToken[]
) {
  const savedHandler = useRef<(ev: KeyboardEvent) => void>(() => {});

  useEffect(() => {
    const keyMap = tokensToKeyMap(inputTokens);
    savedHandler.current = (ev: KeyboardEvent) => {
      const token = keyMap.get(ev.key);
      if (token) {
        ev.preventDefault();
        handler(token);
      }
    };
  }, [handler, inputTokens]);

  useEffect(() => {
    const eventListener = (ev: KeyboardEvent) => savedHandler.current(ev);
    document.addEventListener('keydown', eventListener);

    return () => {
      document.removeEventListener('keydown', eventListener);
    };
  }, []);
}

export function Calculator() {
  const [state, setState] = useState<CalculatorState>({
    numberInput: '0',
    buttonStack: [resetButton],
    tokenStack: [],
  });

  const onButtonClick = (currrentButton: InputToken) => {
    const updatedState = processButtonClick(state, currrentButton);
    setState(updatedState);
  };

  useKeyboardListener(onButtonClick, buttons);

  return (
    <div className="h-full w-full p-2 gap-2 flex flex-col justify-between max-h-[500px] max-w-[500px] framed">
      <Output state={state} />
      <KeyBoard tokens={buttons} onClick={onButtonClick} />
    </div>
  );
}
