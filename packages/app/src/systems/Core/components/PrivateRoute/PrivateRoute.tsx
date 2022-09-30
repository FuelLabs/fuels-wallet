import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import { useIsLogged } from '../../hooks';
import { Pages } from '../../types';

type PrivateRouteProps = {
  children: ReactNode;
};

export function PrivateRoute({ children }: PrivateRouteProps) {
  const isLogged = useIsLogged();

  if (!isLogged) {
    return <Navigate to={Pages.signUp()} replace />;
  }

  return <>{children}</>;
}
