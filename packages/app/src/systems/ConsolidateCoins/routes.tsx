import { Route } from 'react-router-dom';

import { Pages } from '../Core/types';

import { lazyPage } from '~/systems/Core/utils/lazyPage';

const BundlesPage = lazyPage(() =>
  import('./pages/BundlesPage/BundlesPage').then((m) => m.BundlesPage)
);

export const consolidateCoinsRoutes = (
  <Route path={Pages.consolidateCoins()} element={<BundlesPage />} />
);
