import { Route } from 'react-router-dom';

import { Pages } from '../Core/types';

import { lazyPage } from '~/systems/Core/utils/lazyPage';

const Assets = lazyPage(() => import('./pages/Assets').then((m) => m.Assets));
const AssetDetail = lazyPage(() =>
  import('./pages/AssetDetail/AssetDetail').then((m) => m.AssetDetail)
);
const UpsertAsset = lazyPage(() =>
  import('./pages/UpsertAsset/UpsertAsset').then((m) => m.UpsertAsset)
);

export const assetRoutes = (
  <Route path={Pages.assets()}>
    <Route index element={<Assets />} />
    <Route path={Pages.assetsEdit()} element={<UpsertAsset />} />
    <Route path={Pages.assetsAdd()} element={<UpsertAsset />} />
    <Route path={Pages.assetDetail()} element={<AssetDetail />} />
  </Route>
);
