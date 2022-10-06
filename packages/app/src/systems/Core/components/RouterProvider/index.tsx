import type { ReactNode } from 'react';
import { BrowserRouter, HashRouter } from 'react-router-dom';

import { IS_CRX } from '~/config';

export const RouterProvider = ({ children }: { children: ReactNode }) => {
  if (IS_CRX) return <HashRouter>{children}</HashRouter>;
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      {children}
    </BrowserRouter>
  );
};
