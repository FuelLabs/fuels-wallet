import { Route } from 'react-router-dom';

import { Pages } from '../Core/types';

import { lazyPage } from '~/systems/Core/utils/lazyPage';

const TxView = lazyPage(() => import('./pages/TxView').then((m) => m.TxView));
const ViewActivity = lazyPage(() =>
  import('./pages/ViewActivity').then((m) => m.ViewActivity)
);

export const transactionRoutes = (
  <Route path={Pages.txs()}>
    <Route index element={<ViewActivity />} />
    <Route path={Pages.tx()} element={<TxView />} />
  </Route>
);
