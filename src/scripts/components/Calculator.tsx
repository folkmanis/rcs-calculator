import { useEffect, useReducer } from 'react';
import { LOCAL_STORAGE_STATE_KEY } from '../data/constants';
import { buttons } from '../data/tokens';
import { useKeyboardListener } from '../hooks/use-keyboard-listener';
import { processButtonClick } from '../utilities/button-actions';
import { getInitialState } from '../utilities/initial-state';
import { last } from '../utilities/math-utilities';
import { KeyBoard } from './Keyboard';
import { Output } from './Output';

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
