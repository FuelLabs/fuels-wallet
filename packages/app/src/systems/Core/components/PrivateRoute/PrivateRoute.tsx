import { Spinner } from "@fuel-ui/react";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAccounts } from "~/systems/Account";

type PrivateRouteProps = {
  children: ReactNode;
};

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { account, isLoading } = useAccounts();

  if (import.meta.env.MODE === "test" && isLoading) {
    return <Spinner />;
  }

  if (!account) {
    return <Navigate to="/sign-up" replace />;
  }

  return <>{children}</>;
}
