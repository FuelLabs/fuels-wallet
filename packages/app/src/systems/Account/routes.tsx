import { Route } from 'react-router-dom';

import { Pages } from '../Core/types';

import { Accounts, AddAccount, Logout } from './pages';

export const accountRoutes = (
  <Route path={Pages.accounts()}>
    <Route index element={<Accounts />} />
    <Route path={Pages.accountAdd()} element={<AddAccount />} />
    <Route path={Pages.logout()} element={<Logout />} />
  </Route>
);
