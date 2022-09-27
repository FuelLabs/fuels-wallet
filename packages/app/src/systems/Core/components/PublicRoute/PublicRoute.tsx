import type { ReactNode } from "react";
import { Navigate, useLocation, useResolvedPath } from "react-router-dom";

import { PageLinks } from "../../types";

import { IS_CRX } from "~/config";
import { useIsLogged } from "~/systems/Account";

type PublicRouteProps = {
  children: ReactNode;
};

export function PublicRoute({ children }: PublicRouteProps) {
  const location = useLocation();
  const match = useResolvedPath(location.pathname);
  const isLogged = useIsLogged();
  const isSignUp = match.pathname.includes("/sign-up");

  if (isSignUp && isLogged) {
    // TODO: improve routing split between CRX and WebApp
    if (IS_CRX) {
      return <Navigate to={PageLinks.signUpWalletCreated} replace />;
    }
    return <Navigate to={PageLinks.wallet} replace />;
  }

  return <>{children}</>;
}
