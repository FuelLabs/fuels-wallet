import React from 'react';
import { Providers } from '~/systems/Core';

import { IS_DEVELOPMENT, IS_TEST } from './config';
import { getRoutes } from './routes';
import { useRecoverWelcomeFromError } from './systems/Core/hooks/useRecoverWelcomeFromError';

const ThrowError = React.lazy(
  () => import('./systems/Error/components/ThrowError')
);

export function App() {
  useRecoverWelcomeFromError();

  return (
    <Providers>
      {getRoutes()}
      {(IS_TEST || IS_DEVELOPMENT) && <ThrowError />}
    </Providers>
  );
}
