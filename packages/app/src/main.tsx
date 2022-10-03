import '@fontsource/source-code-pro';
import type { ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';

import { App } from './App';
import { IS_CRX } from './config';

const RouterProvider = ({ children }: { children: ReactNode }) => {
  if (IS_CRX) return <HashRouter>{children}</HashRouter>;
  return <BrowserRouter basename={import.meta.env.BASE_URL}>{children}</BrowserRouter>;
};

createRoot(document.getElementById('root')!).render(
  <RouterProvider>
    <App />
  </RouterProvider>
);
