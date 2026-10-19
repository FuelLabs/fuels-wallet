import { Outlet, Route } from 'react-router-dom';

import { Pages } from '../Core/types';

import { lazyPage } from '~/systems/Core/utils/lazyPage';
import { Home } from './pages/Home';

const Receive = lazyPage(() =>
  import('./pages/Receive').then((m) => m.Receive)
);

export const homeRoutes = (
  <Route path={Pages.wallet()}>
    <Route
      index
      element={
        <>
          <Home />
          <Outlet />
        </>
      }
    />
    <Route path={Pages.receive()} element={<Receive />} />
  </Route>
);
