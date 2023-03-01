import { Route } from 'react-router-dom';

import { Pages } from '../Core/types';

import {
  ConnectionRequest,
  SignatureRequest,
  TransactionRequest,
} from './pages';
import { AddAssetRequest } from './pages/AddAssetRequest';

export const dappRoutes = (
  <Route path={Pages.request()}>
    <Route path={Pages.requestConnection()} element={<ConnectionRequest />} />
    <Route path={Pages.requestMessage()} element={<SignatureRequest />} />
    <Route path={Pages.requestTransaction()} element={<TransactionRequest />} />
    <Route path={Pages.requestAddAssets()} element={<AddAssetRequest />} />
  </Route>
);
