import { StrictMode } from 'react';
import { Calculator } from './scripts/components/Calculator';
import './styles.css';

export function App() {
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center p-2">
      <StrictMode>
        <Calculator />
      </StrictMode>
    </div>
  );
}
