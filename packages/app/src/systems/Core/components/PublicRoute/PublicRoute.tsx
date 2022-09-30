import type { ReactNode } from 'react';
import { Navigate, useLocation, useResolvedPath } from 'react-router-dom';

import { useIsLogged } from '../../hooks';
import { Pages } from '../../types';

type PublicRouteProps = {
  children: ReactNode;
};

export function PublicRoute({ children }: PublicRouteProps) {
  const location = useLocation();
  const match = useResolvedPath(location.pathname);
  const isLogged = useIsLogged();
  const isSignUp = match.pathname.includes(Pages.signUp());

  if (isSignUp && isLogged) {
    return <Navigate to={Pages.home()} replace />;
  }

  return <>{children}</>;
}
