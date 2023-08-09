import { InputToken } from '../types/token.interface';
import parse from 'html-react-parser';
import { Ripple } from './Ripple';

export interface ButtonProps {
  token: InputToken;
  onClick: (token: InputToken) => void;
}

export function Button({ token, onClick }: ButtonProps) {
  const classes = ['framed', 'key-button', ...(token.styles ?? [])].join(' ');
  return (
    <div className={classes}>
      <button
        onClick={() => {
          onClick(token);
        }}
      >
        {parse(token.html)}
        <Ripple />
      </button>
    </div>
  );
}
