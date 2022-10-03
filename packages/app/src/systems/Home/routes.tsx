import { Outlet, Route } from 'react-router-dom';

import { Pages } from '../Core/types';
import { FaucetDialog } from '../Faucet/components';

import { Home } from './pages';

export const homeRoutes = (
  <Route
    path={Pages.wallet()}
    element={
      <>
        <Home />
        <Outlet />
      </>
    }
  >
    <Route path={Pages.faucet()} element={<FaucetDialog />} />
  </Route>
);
