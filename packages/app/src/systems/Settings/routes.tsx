import { Route } from 'react-router-dom';

import { Pages } from '../Core/types';

import { ChangePassword, Connections } from './pages';

export const settingsRoutes = (
  <Route path={Pages.settings()}>
    <Route element={<ChangePassword />} path={Pages.settingsChangePassword()} />
    <Route element={<Connections />} path={Pages.settingsConnectedApps()} />
  </Route>
);
