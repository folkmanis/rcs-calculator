import { ERROR_TEXT } from '../data/constants';
import { inputStringToDisplay } from '../utilities/number-input';

export interface OutputActiveValueProps {
  value: string;
  isError: boolean;
}

export function OutputActiveValue({ value, isError }: OutputActiveValueProps) {
  if (isError) {
    return <div className="output-value text-red-600">{ERROR_TEXT}</div>;
  } else {
    return <div className="output-value">{inputStringToDisplay(value)}</div>;
  }
}
