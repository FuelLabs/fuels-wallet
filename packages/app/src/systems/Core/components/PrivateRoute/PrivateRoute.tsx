import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAccounts } from "~/systems/Account";

type PrivateRouteProps = {
  children: ReactNode;
};

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { account } = useAccounts();

  if (!account) {
    return <Navigate to="/sign-up" replace />;
  }

  return <>{children}</>;
}
