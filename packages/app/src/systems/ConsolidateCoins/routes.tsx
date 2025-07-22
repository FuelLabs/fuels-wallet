import { Route } from 'react-router-dom';

import { Pages } from '../Core/types';

import { BundlesPage } from './pages/BundlesPage/BundlesPage';

export const consolidateCoinsRoutes = (
  <Route path={Pages.consolidateCoins()} element={<BundlesPage />} />
);
