import type { ReactNode } from 'react';

import { useAccount } from '../../hooks';
import { Unlock } from '../../pages';

export type LockedRouteProps = {
  children: ReactNode;
};

export function LockedRoute({ children }: LockedRouteProps) {
  const { isLocked } = useAccount();
  return isLocked ? <Unlock ghostChildren={children} /> : <>{children}</>;
}
