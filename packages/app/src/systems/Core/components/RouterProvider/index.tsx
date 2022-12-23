import type { ReactNode } from 'react';
import { HashRouter } from 'react-router-dom';

export const RouterProvider = ({ children }: { children: ReactNode }) => {
  return <HashRouter>{children}</HashRouter>;
};
