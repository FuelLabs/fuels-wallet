import { Route } from 'react-router-dom';

import { Pages } from '../Core/types';

import { SignatureRequest } from './pages';
import { ConnectionRequest } from './pages/ConnectionRequest';

export const dappRoutes = (
  <Route path={Pages.request()}>
    <Route path={Pages.requestConnection()} element={<ConnectionRequest />} />
    <Route path={Pages.requestMessage()} element={<SignatureRequest />} />
  </Route>
);
