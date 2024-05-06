import { Outlet, Route } from 'react-router-dom';

import { Pages } from '../Core/types';

import { Home, Receive } from './pages';

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
