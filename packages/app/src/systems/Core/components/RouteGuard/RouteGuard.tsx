import type { ReactNode } from 'react';

import { useIsLogged } from '../../hooks';

type RouteGuardProps = {
  children: ReactNode;
  reject: ReactNode;
  cond?: (isLogged: boolean) => boolean;
};

export const guards = {
  isLoggedIn: (i: boolean) => i,
  isNotLoggedIn: (i: boolean) => !i,
};

/**
 * Protects a page, let user access only
 * if is logged-in.
 */
export function RouteGuard({
  children,
  reject,
  cond = guards.isLoggedIn,
}: RouteGuardProps) {
  const isLogged = useIsLogged();

  if (!cond(isLogged)) {
    return <>{reject}</>;
  }

  return <>{children}</>;
}
