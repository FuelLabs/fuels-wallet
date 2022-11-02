import { Route } from 'react-router-dom';

import { Pages } from '../Core/types';

import { RecoverPassphrase } from './pages';

export const settingsRoutes = (
  <Route path={Pages.settings()}>
    <Route element={<RecoverPassphrase />} path={Pages.recoverPassphrase()} />
  </Route>
);
