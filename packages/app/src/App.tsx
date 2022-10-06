import { getRoutes } from './routes';

import { Providers } from '~/systems/Core';

export function App() {
  return <Providers>{getRoutes()}</Providers>;
}
