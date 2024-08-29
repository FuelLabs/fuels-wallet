import { Outlet } from 'react-router-dom';

import { useUnlock } from '../hooks';
import { UnlockPage } from '../pages';

export function UnlockGuard() {
  const { isUnlocked } = useUnlock();

  if (isUnlocked) {
    return <Outlet />;
  }

  return <UnlockPage />;
}
