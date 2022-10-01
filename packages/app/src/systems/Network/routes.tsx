import { Route } from 'react-router-dom';

import { PrivateRoute } from '../Core/components/PrivateRoute';
import { Pages } from '../Core/types';

import { AddNetwork } from './pages/AddNetwork';
import { Networks } from './pages/Networks';
import { UpdateNetwork } from './pages/UpdateNetwork';

export const networkRoutes = (
  <Route path={Pages.networks()} element={<PrivateRoute />}>
    <Route index element={<Networks />} />
    <Route path={Pages.networkUpdate()} element={<UpdateNetwork />} />
    <Route path={Pages.networkAdd()} element={<AddNetwork />} />
  </Route>
);
