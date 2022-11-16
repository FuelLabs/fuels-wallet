import { Route } from 'react-router-dom';

import { Pages } from '../Core/types';

import { ChangePassword, RevealPassphrase } from './pages';

export const settingsRoutes = (
  <Route path={Pages.settings()}>
    <Route element={<RevealPassphrase />} path={Pages.revealPassphrase()} />
    <Route element={<ChangePassword />} path={Pages.changePassword()} />
  </Route>
);
