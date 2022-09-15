import type { ReactNode } from "react";
import { Navigate, useLocation, useResolvedPath } from "react-router-dom";

import { useAccounts } from "~/systems/Account";

type PublicRouteProps = {
  children: ReactNode;
};

export function PublicRoute({ children }: PublicRouteProps) {
  const { accounts } = useAccounts();
  const location = useLocation();
  const match = useResolvedPath(location.pathname);
  const isSignUp = match.pathname.includes("/sign-up");
  const isLogged = localStorage.getItem("fuel__isLogged");

  if (isLogged) {
    return <Navigate to="/wallet" replace />;
  }

  if (!isSignUp && accounts != null && accounts?.length) {
    return <Navigate to="/wallet" replace />;
  }

  return <>{children}</>;
}
