import { Route } from 'react-router-dom';

import { Pages } from '../Core/types';

import { SignatureRequest, TxApprove } from './pages';

export const dappRoutes = (
  <Route path={Pages.dapp()}>
    <Route index path={Pages.signMessage()} element={<SignatureRequest />} />
    <Route index path={Pages.txApprove()} element={<TxApprove />} />
  </Route>
);
