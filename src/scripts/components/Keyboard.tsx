import { InputToken } from '../data/token.interface';
import { Button } from './Button';

export interface KeyBoardProps {
  tokens: InputToken[];
  onClick: (token: InputToken) => void;
}

export function KeyBoard({ tokens, onClick }: KeyBoardProps) {
  const buttons = tokens.map((token, idx) => {
    return <Button key={idx} token={token} onClick={onClick} />;
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
