import { Route } from 'react-router-dom';

import { Pages } from '../Core/types';

import { SignatureRequest } from './pages';

export const dappRoutes = (
  <Route path={Pages.dapp()}>
    <Route index element={<SignatureRequest />} />
  </Route>
);
