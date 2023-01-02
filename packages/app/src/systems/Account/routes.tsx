import { Route } from 'react-router-dom';

import { Pages } from '../Core/types';

import { Accounts, AddAccount } from './pages';

export const accountRoutes = (
  <Route path={Pages.accounts()}>
    <Route index element={<Accounts />} />
    <Route path={Pages.accountAdd()} element={<AddAccount />} />
  </Route>
);
