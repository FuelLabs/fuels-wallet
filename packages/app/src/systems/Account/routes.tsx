import { Route } from 'react-router-dom';

import { Pages } from '../Core';

import { Accounts } from './pages';

export const accountRoutes = (
  <Route path={Pages.accounts()}>
    <Route index element={<Accounts />} />
  </Route>
);
