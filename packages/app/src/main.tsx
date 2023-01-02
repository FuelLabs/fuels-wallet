import '@fontsource/source-code-pro';
import { createRoot } from 'react-dom/client';

import { App } from './App';
import { RouterProvider, GraphqlProvider } from './systems/Core';

createRoot(document.getElementById('root')!).render(
  <GraphqlProvider>
    <RouterProvider>
      <App />
    </RouterProvider>
  </GraphqlProvider>
);
