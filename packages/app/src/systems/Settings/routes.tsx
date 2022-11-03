import { Route } from 'react-router-dom';

import { Pages } from '../Core/types';

import { ChangePassword, RecoverPassphrase } from './pages';

export const settingsRoutes = (
  <Route path={Pages.settings()}>
    <Route element={<RecoverPassphrase />} path={Pages.recoverPassphrase()} />
    <Route element={<ChangePassword />} path={Pages.changePassword()} />
  </Route>
);
