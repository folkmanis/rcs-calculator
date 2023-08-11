import { useEffect, useReducer } from 'react';
import { buttons } from '../data/buttons';
import { LOCAL_STORAGE_STATE_KEY } from '../data/constants';
import { processButtonClick } from '../utilities/button-actions';
import { getInitialState } from '../utilities/initial-state';
import { lastStateOrDefault } from '../utilities/last-state';
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

  return (
    <div className="h-full w-full p-2 gap-2 flex flex-col justify-between max-h-[500px] max-w-[500px] framed">
      <Output state={lastStateOrDefault(stateStack)} />
      <KeyBoard tokenNames={buttons} onClick={dispatchToken} />
    </div>
  );
}
