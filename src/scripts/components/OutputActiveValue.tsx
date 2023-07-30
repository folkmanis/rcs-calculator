import { MAX_DIGITS, ERROR_TEXT } from '../data/constants';

export interface OutputActiveValueProps {
  value: string;
  isError: boolean;
}

export function OutputActiveValue({ value, isError }: OutputActiveValueProps) {
  if (!isError && value.length > MAX_DIGITS && value.includes('.')) {
    value = (+value).toPrecision(MAX_DIGITS - 2);
  }

  if (isError) {
    return <div className="output-value text-red-600">{ERROR_TEXT}</div>;
  } else {
    return <div className="output-value">{value.replace('.', ',')}</div>;
  }
}
