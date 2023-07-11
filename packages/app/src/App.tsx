import React from 'react';

import { IS_DEVELOPMENT, IS_TEST } from './config';
import { getRoutes } from './routes';

import { Providers } from '~/systems/Core';

const ThrowError = React.lazy(
  () => import('./systems/Error/components/ThrowError')
);

export function App() {
  return (
    <Providers>
      {getRoutes()}
      {(IS_TEST || IS_DEVELOPMENT) && <ThrowError />}
    </Providers>
  );
}
