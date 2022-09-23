import type { ReactNode } from "react";
import { Navigate, useLocation, useResolvedPath } from "react-router-dom";

import { useAccounts } from "~/systems/Account";

type PublicRouteProps = {
  children: ReactNode;
};

export function PublicRoute({ children }: PublicRouteProps) {
  const { account } = useAccounts();
  const location = useLocation();
  const match = useResolvedPath(location.pathname);
  const isSignUp = match.pathname.includes("/sign-up");

  if (!isSignUp && !account) {
    return <Navigate to="/wallet" replace />;
  }

  return <>{children}</>;
}
