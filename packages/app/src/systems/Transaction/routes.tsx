import { Route } from 'react-router-dom';

import { Pages } from '../Core/types';

import { ViewTransaction, ViewActivity } from './pages';

export const transactionRoutes = (
  <Route path={Pages.txs()} element={<ViewActivity />}>
    <Route path={Pages.tx()} element={<ViewTransaction />} />
  </Route>
);
