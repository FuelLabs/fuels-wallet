import { Route } from 'react-router-dom';

import { Pages } from '../Core/types';

import { Unlock } from './pages/Unlock';

export const accountRoutes = (
  <Route path={Pages.account()}>
    <Route path={Pages.unlock()} element={<Unlock />} />
  </Route>
);
