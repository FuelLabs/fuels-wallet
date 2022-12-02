import { Route } from 'react-router-dom';

import { Pages } from '../Core/types';

import { ChangePassword, RevealPassphrase } from './pages';

export const settingsRoutes = (
  <Route path={Pages.settings()}>
    <Route
      element={<RevealPassphrase />}
      path={Pages.settingsRevealPassphrase()}
    />
    <Route element={<ChangePassword />} path={Pages.settingsChangePassword()} />
  </Route>
);
