import { Route } from 'react-router-dom';

import { Pages } from '../Core/types';

import {
  ConnectionRequest,
  SignatureRequest,
  TransactionRequest,
} from './pages';

export const dappRoutes = (
  <Route path={Pages.request()}>
    <Route path={Pages.requestConnection()} element={<ConnectionRequest />} />
    <Route path={Pages.requestMessage()} element={<SignatureRequest />} />
    <Route path={Pages.requestTransaction()} element={<TransactionRequest />} />
  </Route>
);
