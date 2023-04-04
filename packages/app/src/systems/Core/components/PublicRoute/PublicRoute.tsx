import type { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { Pages } from '../../types';
import { guards, RouteGuard } from '../RouteGuard';

type PublicRouteProps = {
  redirect?: string;
  children?: ReactNode;
};

export const PublicRoute = ({
  redirect = Pages.wallet(),
  children,
}: PublicRouteProps) => (
  <RouteGuard cond={guards.isNotLoggedIn} reject={<Navigate to={redirect} />}>
    {children || <Outlet />}
  </RouteGuard>
);
