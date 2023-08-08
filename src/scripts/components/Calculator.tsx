import { useEffect, useReducer, useRef } from 'react';
import { LOCAL_STORAGE_STATE_KEY } from '../data/constants';
import { tokensToKeyMap } from '../data/token-utilities';
import { InputToken } from '../data/token.interface';
import { buttons } from '../data/tokens';
import { processButtonClick } from '../utilities/button-actions';
import { getInitialState } from '../utilities/initial-state';
import { last } from '../utilities/math-utilities';
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
  const [stateStack, dispatchToken] = useReducer(
    processButtonClick,
    getInitialState()
  );

  useEffect(() => {
    window.localStorage.setItem(
      LOCAL_STORAGE_STATE_KEY,
      JSON.stringify(stateStack)
    );
  }, [stateStack]);

  useKeyboardListener(dispatchToken, buttons);

  return (
    <div className="h-full w-full p-2 gap-2 flex flex-col justify-between max-h-[500px] max-w-[500px] framed">
      <Output state={last(stateStack)} />
      <KeyBoard tokens={buttons} onClick={dispatchToken} />
    </div>
  );
}
