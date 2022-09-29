import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import { useIsLogged } from '../../hooks';

type PrivateRouteProps = {
  children: ReactNode;
};

export function PrivateRoute({ children }: PrivateRouteProps) {
  const isLogged = useIsLogged();

  if (!isLogged) {
    return <Navigate to="/sign-up" replace />;
  }

  return <>{children}</>;
}
