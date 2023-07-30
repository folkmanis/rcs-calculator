import parse from 'html-react-parser';

export interface OutputExpressionProps {
  expression: string;
}
export function OutputExpression({ expression }: OutputExpressionProps) {
  return <div className="text-right h-1/3">{parse(expression)}</div>;
}
