import { Route } from 'react-router-dom';

import { Pages } from '../Core/types';

import { lazyPage } from '~/systems/Core/utils/lazyPage';

const ChangePassword = lazyPage(() =>
  import('./pages/ChangePassword').then((m) => m.ChangePassword)
);
const Connections = lazyPage(() =>
  import('./pages/Connections').then((m) => m.Connections)
);

export const settingsRoutes = (
  <Route path={Pages.settings()}>
    <Route element={<ChangePassword />} path={Pages.settingsChangePassword()} />
    <Route element={<Connections />} path={Pages.settingsConnectedApps()} />
  </Route>
);
