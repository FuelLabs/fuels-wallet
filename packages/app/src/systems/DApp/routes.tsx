import { Route } from 'react-router-dom';

import { Pages } from '../Core/types';

import { lazyPage } from '~/systems/Core/utils/lazyPage';

const AddAssetRequest = lazyPage(() =>
  import('./pages/AddAssetRequest').then((m) => m.AddAssetRequest)
);
const ConnectionRequest = lazyPage(() =>
  import('./pages/ConnectionRequest').then((m) => m.ConnectionRequest)
);
const SelectNetworkRequest = lazyPage(() =>
  import('./pages/SelectNetworkRequest').then((m) => m.SelectNetworkRequest)
);
const SignatureRequest = lazyPage(() =>
  import('./pages/SignatureRequest').then((m) => m.SignatureRequest)
);
const TransactionRequest = lazyPage(() =>
  import('./pages/TransactionRequest').then((m) => m.TransactionRequest)
);

export const dappRoutes = (
  <Route path={Pages.request()}>
    <Route path={Pages.requestConnection()} element={<ConnectionRequest />} />
    <Route path={Pages.requestMessage()} element={<SignatureRequest />} />
    <Route path={Pages.requestTransaction()} element={<TransactionRequest />} />
    <Route path={Pages.requestAddAssets()} element={<AddAssetRequest />} />
    <Route
      path={Pages.requestSelectNetwork()}
      element={<SelectNetworkRequest />}
    />
  </Route>
);
