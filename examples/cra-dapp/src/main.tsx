import { FuelProvider } from '@fuel-wallet/react';
import React from 'react';
import ReactDOM from 'react-dom/client';


import App from './App.tsx';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <FuelProvider>
      <App />
    </FuelProvider>
  </React.StrictMode>
);
