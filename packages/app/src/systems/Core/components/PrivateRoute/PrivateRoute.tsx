import type { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { Pages } from '../../types';
import { guards, RouteGuard } from '../RouteGuard';

type PrivateRouteProps = {
  redirect?: string;
  children?: ReactNode;
};

export const PrivateRoute = ({ redirect = Pages.signUpWelcome(), children }: PrivateRouteProps) => (
  <RouteGuard cond={guards.isLoggedIn} reject={<Navigate to={redirect} />}>
    {children || <Outlet />}
  </RouteGuard>
);
