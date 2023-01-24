import { Route } from 'react-router-dom';

import { Pages } from '../Core/types';

import { TxView, ViewActivity } from './pages';

export const transactionRoutes = (
  <Route path={Pages.txs()}>
    <Route index element={<ViewActivity />} />
    <Route path={Pages.tx()} element={<TxView />} />
  </Route>
);
