import React from 'react';
import ReactDOM from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';

import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary
      FallbackComponent={() => null}
      // eslint-disable-next-line no-console
      onError={(err) => console.error(err)}
    >
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
