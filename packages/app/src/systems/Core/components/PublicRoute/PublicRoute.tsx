import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAccounts } from "~/systems/Account";

type PublicRouteProps = {
  children: ReactNode;
};

export function PublicRoute({ children }: PublicRouteProps) {
  const { accounts, isLoading } = useAccounts();
  if (!isLoading && accounts?.length) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}
