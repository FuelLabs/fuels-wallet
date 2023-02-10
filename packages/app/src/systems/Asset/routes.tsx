import { Route } from 'react-router-dom';

import { Pages } from '../Core/types';

import { Assets } from './pages';
import { UpsertAsset } from './pages/UpsertAsset/UpsertAsset';

export const assetRoutes = (
  <Route path={Pages.assets()}>
    <Route index element={<Assets />} />
    <Route path={Pages.assetsEdit()} element={<UpsertAsset />} />
    <Route path={Pages.assetsAdd()} element={<UpsertAsset />} />
  </Route>
);
