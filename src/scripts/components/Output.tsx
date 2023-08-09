import { CalculatorState } from '../types/calculator-state.interface';
import { OutputActiveValue } from './OutputActiveValue';
import { OutputExpression } from './OutputExpression';

export interface OutputProps {
  state: CalculatorState;
}

export function Output({ state }: OutputProps) {
  const isError = !(state.errorState == null);
  const activeValue
    = typeof state.result === 'number'
      ? state.result.toString()
      : state.numberInput;
  let expression = state.tokenStack.map(token => token.html).join(' ');
  if (typeof state.result === 'number') {
    expression += ' = ' + state.result.toLocaleString();
  }
  return (
    <div className="h-1/5 framed bg-neutral-200 p-2 flex flex-col">
      <OutputExpression expression={expression} />
      <OutputActiveValue value={activeValue} isError={isError} />
    </div>
  );
}
