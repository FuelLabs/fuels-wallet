import type { ReactNode } from 'react';
import { Navigate, useLocation, useResolvedPath } from 'react-router-dom';

import { useIsLogged } from '../../hooks';

type PublicRouteProps = {
  children: ReactNode;
};

export function PublicRoute({ children }: PublicRouteProps) {
  const location = useLocation();
  const match = useResolvedPath(location.pathname);
  const isLogged = useIsLogged();
  const isSignUp = match.pathname.includes('/sign-up');

  if (isSignUp && isLogged) {
    return <Navigate to="/wallet" replace />;
  }

  return <>{children}</>;
}
