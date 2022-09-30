import type { ReactNode } from 'react';
import { Navigate, useLocation, useResolvedPath } from 'react-router-dom';

import { useIsLogged } from '../../hooks';
import { Pages } from '../../types';

import { IS_CRX } from '~/config';

type PublicRouteProps = {
  children: ReactNode;
};

export function PublicRoute({ children }: PublicRouteProps) {
  const location = useLocation();
  const match = useResolvedPath(location.pathname);
  const isLogged = useIsLogged();
  const isSignUp = match.pathname.includes(Pages.signUp());

  if (isSignUp && isLogged) {
    // TODO: improve routing split between CRX and WebApp
    if (IS_CRX) {
      return <Navigate to={Pages.signUpCreateWallet()} replace />;
    }
    return <Navigate to={Pages.home()} replace />;
  }

  return <>{children}</>;
}
