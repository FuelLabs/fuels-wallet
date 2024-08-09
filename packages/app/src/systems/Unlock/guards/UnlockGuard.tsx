import { Outlet } from 'react-router-dom';

import { ErrorFloatingButton } from '~/systems/Error/components/ErrorFloatingButton';
import { useUnlock } from '../hooks';
import { UnlockPage } from '../pages';

export function UnlockGuard() {
  const { isUnlocked } = useUnlock();

  if (isUnlocked) {
    return (
      <>
        <ErrorFloatingButton />
        <Outlet />
      </>
    );
  }

  return <UnlockPage />;
}
