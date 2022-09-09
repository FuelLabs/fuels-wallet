import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAccounts } from "~/systems/Account/hooks";

type PrivateRouteProps = {
  children: ReactNode;
};

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { isLoading, accounts } = useAccounts();

  if (isLoading === false && accounts != null && !accounts?.length) {
    return <Navigate to="/sign-up" replace />;
  }

  return <>{children}</>;
}
