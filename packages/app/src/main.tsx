import '@fontsource/source-code-pro';
import { createRoot } from 'react-dom/client';

import { App } from './App';
import './exports';
import { RouterProvider } from './systems/Core/components/RouterProvider';

createRoot(document.getElementById('root')!).render(
  <RouterProvider>
    <App />
  </RouterProvider>
);
