import { IS_DEVELOPMENT, IS_TEST } from './config';
import { getRoutes } from './routes';
import { ThrowError } from './systems/Error';

import { Providers } from '~/systems/Core';

export function App() {
  return (
    <Providers>
      {getRoutes()} {(IS_TEST || IS_DEVELOPMENT) && <ThrowError />}
    </Providers>
  );
}
