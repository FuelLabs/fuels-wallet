import React from 'react';
import { Providers, useRecoverWelcomeFromError } from '~/systems/Core';

import { IS_DEVELOPMENT, IS_TEST } from './config';
import { getRoutes } from './routes';

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
