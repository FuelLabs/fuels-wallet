import { Route } from 'react-router-dom';

import { Pages } from '../Core/types';

import { TxView } from './pages';

export const transactionRoutes = (
  <Route path={Pages.txs()}>
    <Route path={Pages.tx()} element={<TxView />} />
  </Route>
);
