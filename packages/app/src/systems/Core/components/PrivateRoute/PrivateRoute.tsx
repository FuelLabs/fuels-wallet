import { BoxCentered, Spinner } from "@fuel-ui/react";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAccounts } from "~/systems/Account";

type PrivateRouteProps = {
  children: ReactNode;
};

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { accounts, isLoading } = useAccounts();
  if (isLoading) {
    return (
      <BoxCentered minWS minHS>
        <Spinner />
      </BoxCentered>
    );
  }
  if (!isLoading && !accounts?.length) {
    return <Navigate to="/sign-up" replace />;
  }
  return <>{children}</>;
}
